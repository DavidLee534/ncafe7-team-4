package com.newcafe.backend.service;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.dto.recipe.RecipeCreateRequestDto;
import com.newcafe.backend.dto.recipe.RecipeIngredientListResponseDto;
import com.newcafe.backend.repository.IngredientRepository;
import com.newcafe.backend.service.admin.IngredientService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

// 연금 공방 포션 만들기 — README "포션 조합 시스템"의 예시 이름 · 가격과 선반 규칙을 시드 재료로 확인한다
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:alchemy;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=false"
})
@Transactional
class RecipeAlchemyIntegrationTest {
  @Autowired RecipeService recipes;
  @Autowired IngredientService ingredients;
  @Autowired IngredientRepository ingredientRepository;
  @Autowired JdbcTemplate jdbc;
  @MockitoBean CurrentMember currentMember;

  @BeforeEach
  void loginCheese() {
    when(currentMember.id()).thenReturn(jdbc.queryForObject("select id from members where email='cheese@ncafe.dev'", Long.class));
  }

  private Long menu(String slug) {
    return jdbc.queryForObject("select id from menus where slug=?", Long.class, slug);
  }

  private List<Long> extras(String... names) {
    return Arrays.stream(names)
        .map(name -> jdbc.queryForObject("select id from ingredients where name=?", Long.class, name))
        .toList();
  }

  private RecipeCreateRequestDto brew(String slug, String... extraNames) {
    return new RecipeCreateRequestDto(menu(slug), extras(extraNames));
  }

  @Test
  void namesAndPricesFollowTheReadmeExamples() {
    var plain = recipes.create(brew("dark-roast-coffee"));
    assertThat(plain.name()).isEqualTo("칠흑 고양이의 물약");
    assertThat(plain.price()).isEqualTo(4000);
    assertThat(plain.grade()).isEqualTo("normal");
    assertThat(plain.color()).isEqualTo("#3B2416");

    assertThat(recipes.create(brew("dark-roast-coffee", "헤이즐넛")).name()).isEqualTo("숲향 품은 칠흑 고양이의 물약");

    // 고른 순서와 상관없이 수식어는 우선순위 · 가나다순
    var tea = recipes.create(brew("chamomile-tea", "레몬청", "꿀"));
    assertThat(tea.name()).isEqualTo("꿀빛 · 햇살 스민 잠드는 꼬리");
    assertThat(tea.price()).isEqualTo(5500);
    assertThat(tea.grade()).isEqualTo("rare");

    // 3개 이상: 효과 칭호(달콤함 2) + 대표 수식어(캐러멜 30)
    var three = recipes.create(brew("dark-roast-coffee", "휘핑", "오트", "캐러멜"));
    assertThat(three.name()).isEqualTo("달콤한 축복의 · 황금빛 칠흑 고양이의 물약");
    assertThat(three.extras()).containsExactly("휘핑", "오트", "캐러멜");

    assertThat(recipes.create(brew("dark-roast-coffee", "바닐라", "오트")).price()).isEqualTo(5000);
  }

  @Test
  void secretRecipeUsesItsOwnNameGradeAndRecordsTheFirstDiscovery() {
    var first = recipes.create(brew("dark-roast-coffee", "마시멜로", "캐러멜", "오트"));
    assertThat(first.name()).isEqualTo("대연금술사의 황금 꼬리");
    assertThat(first.grade()).isEqualTo("legend");
    assertThat(first.color()).isEqualTo("#d9a03c");
    assertThat(first.newlyDiscovered()).isTrue();
    assertThat(recipes.create(brew("dark-roast-coffee", "캐러멜", "오트", "마시멜로")).newlyDiscovered()).isFalse();

    // 치즈손님은 시드에서 이미 찾은 레시피
    var known = recipes.create(brew("dark-roast-coffee", "바닐라"));
    assertThat(known.secretRecipeName()).isEqualTo("빛과 어둠의 균형 포션");
    assertThat(known.grade()).isEqualTo("rare");
    assertThat(known.newlyDiscovered()).isFalse();
  }

  @Test
  void usedIngredientsAreStoredWithThePotion() {
    var potion = recipes.create(brew("bagel", "연어", "크림치즈"));
    assertThat(potion.secretRecipeName()).isEqualTo("바다 사냥꾼 식량");
    List<String> stored = jdbc.queryForList(
        "select i.name from recipe_ingredients ri join ingredients i on ri.ingredient_id = i.id where ri.recipe_id=? order by ri.id",
        String.class, potion.id());
    assertThat(stored).containsExactly("베이글", "연어", "크림치즈");
  }

  @Test
  void shelfRulesRejectBadCombinations() {
    assertThatThrownBy(() -> recipes.create(brew("dark-roast-coffee", "요거트"))).hasMessageContaining("넣을 수 없는");
    assertThatThrownBy(() -> recipes.create(brew("dark-roast-coffee", "바닐라", "캐러멜", "헤이즐넛"))).hasMessageContaining("시럽");
    assertThatThrownBy(() -> recipes.create(brew("dark-roast-coffee", "우유", "오트"))).hasMessageContaining("우유");
    assertThatThrownBy(() -> recipes.create(brew("chamomile-tea", "레몬청", "자몽청"))).hasMessageContaining("과일청");
    assertThatThrownBy(() -> recipes.create(brew("bagel"))).hasMessageContaining("푸드 속재료");
    assertThatThrownBy(() -> recipes.create(brew("dark-roast-coffee", "타피오카 펄"))).hasMessageContaining("고를 수 없는");
    assertThatThrownBy(() -> recipes.create(brew("dark-roast-coffee", "다크 로스트"))).hasMessageContaining("고를 수 없는");
  }

  @Test
  void shelvesOpenPerLineWithoutExcludedIngredients() {
    var lines = recipes.getIngredients();
    RecipeIngredientListResponseDto coffee = lines.stream().filter(line -> line.categoryName().equals("커피")).findFirst().orElseThrow();
    assertThat(coffee.shelves()).extracting(RecipeIngredientListResponseDto.Shelf::name).containsExactly("시럽", "우유", "음료 토핑");
    assertThat(coffee.shelves().get(1).extras()).extracting(RecipeIngredientListResponseDto.Extra::name).doesNotContain("요거트");
    assertThat(coffee.shelves().get(2).extras()).extracting(RecipeIngredientListResponseDto.Extra::name).doesNotContain("과육", "타피오카 펄");
    assertThat(coffee.bases()).allSatisfy(base -> assertThat(base.ingredientId()).isNotNull());
    assertThat(coffee.bases().get(0).alchemyName()).isEqualTo("칠흑 고양이의 물약");

    RecipeIngredientListResponseDto tea = lines.stream().filter(line -> line.categoryName().equals("티")).findFirst().orElseThrow();
    assertThat(tea.shelves().get(0).extras()).extracting(RecipeIngredientListResponseDto.Extra::name).containsExactly("꿀");
    assertThat(tea.shelves().get(1).extras()).extracting(RecipeIngredientListResponseDto.Extra::group).containsOnly("과일청", "허브");
  }

  @Test
  void ingredientsUsedByPotionsOrSecretRecipesCannotBeDeleted() {
    assertThatThrownBy(() -> ingredients.delete(extras("바닐라").get(0))).hasMessageContaining("삭제할 수 없습니다");
    assertThatThrownBy(() -> ingredients.delete(extras("라벤더").get(0))).hasMessageContaining("삭제할 수 없습니다");
    Long soyMilk = extras("두유").get(0);
    ingredients.delete(soyMilk);
    assertThat(ingredientRepository.existsById(soyMilk)).isFalse();
  }
}
