package com.newcafe.backend.service;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.recipe.RecipeCreateRequestDto;
import com.newcafe.backend.dto.recipe.RecipeCreatedResponseDto;
import com.newcafe.backend.dto.recipe.RecipeEmotionListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeIngredientListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeMenuListRequestDto;
import com.newcafe.backend.dto.recipe.RecipeMenuListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeRecommendationRequestDto;
import com.newcafe.backend.dto.recipe.RecipeRecommendationResponseDto;
import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Ingredient;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.entity.Recipe;
import com.newcafe.backend.entity.RecipeIngredient;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipeDiscovery;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.IngredientRepository;
import com.newcafe.backend.repository.MemberRepository;
import com.newcafe.backend.repository.MenuRepository;
import com.newcafe.backend.repository.RecipeIngredientRepository;
import com.newcafe.backend.repository.RecipeRepository;
import com.newcafe.backend.repository.SecretRecipeDiscoveryRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfRecipeService implements RecipeService {

  private static final int RECOMMENDATION_SIZE = 4;

  private final CurrentMember currentMember;
  private final MemberRepository memberRepository;
  private final MenuRepository menuRepository;
  private final CategoryRepository categoryRepository;
  private final IngredientRepository ingredientRepository;
  private final RecipeRepository recipeRepository;
  private final RecipeIngredientRepository recipeIngredientRepository;
  private final SecretRecipeRepository secretRecipeRepository;
  private final SecretRecipeDiscoveryRepository secretRecipeDiscoveryRepository;

  // 포션 만들기 → 도감 저장 (README "포션 조합 시스템")
  // 추가 재료는 그 계열에 열린 선반의 손님에게 보이는 재료만, 제외 재료는 빼고, 선반마다 정한 개수 안에서 고른다 (어기면 400)
  // 가격 = 기반 메뉴 가격 + 추가 재료 금액
  // 재료 조합이 비밀 레시피와 같으면 그 레시피의 이름 · 등급 · 색을 쓰고, 처음 맞혔으면 발견 기록도 남긴다
  // 아니면 이름은 수식어 · 효과 칭호 규칙으로 짓고, 등급은 추가 재료 2개 이상이면 rare, 아니면 normal
  @Override
  @Transactional
  public RecipeCreatedResponseDto create(RecipeCreateRequestDto request) {
    Member member = findMember();
    Menu baseMenu = menuRepository.findById(request.baseMenuId())
        .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + request.baseMenuId()));
    if (!"on".equals(statusOf(baseMenu)) || !isVisible(baseMenu.getCategory())) {
      throw new IllegalStateException("지금은 이 메뉴로 포션을 만들 수 없습니다: " + baseMenu.getKorName());
    }

    AlchemyRules.Line line = AlchemyRules.lineOf(baseMenu.getCategory());
    String baseName = AlchemyRules.baseIngredientNameOf(baseMenu);
    Ingredient base = ingredientRepository.findByName(baseName)
        .filter(ingredient -> ingredient.getKind() == Ingredient.Kind.BASE)
        .orElse(null);
    List<Ingredient> extras = findExtras(request.extraIdsOrEmpty(), line);

    SecretRecipe secretRecipe = findSecretRecipe(base, extras);
    int price = baseMenu.getPrice() + extras.stream().mapToInt(Ingredient::getPrice).sum();
    List<String> effectTags = new ArrayList<>(base != null ? base.effectTagList() : List.of());
    extras.forEach(extra -> effectTags.addAll(extra.effectTagList()));

    Recipe saved = recipeRepository.save(Recipe.builder()
        .member(member)
        .baseMenu(baseMenu)
        .secretRecipe(secretRecipe)
        .name(secretRecipe != null ? secretRecipe.getName() : AlchemyRules.potionName(AlchemyRules.alchemyNameOf(baseMenu), extras, effectTags))
        .grade(secretRecipe != null ? secretRecipe.getGrade() : extras.size() >= 2 ? "rare" : "normal")
        .price(price)
        .color(secretRecipe != null
            ? secretRecipe.getColor()
            : AlchemyRules.mixColor(base != null ? base.getColor() : line.color(), extras.stream().map(Ingredient::getColor).toList()))
        .build());

    // 포션에 들어간 재료 (기반 재료 + 추가 재료)
    List<Ingredient> used = new ArrayList<>(extras);
    if (base != null) {
      used.add(0, base);
    }
    recipeIngredientRepository.saveAll(used.stream()
        .map(ingredient -> RecipeIngredient.builder().recipe(saved).ingredient(ingredient).build())
        .toList());

    boolean newlyDiscovered = secretRecipe != null
        && !secretRecipeDiscoveryRepository.existsByMemberIdAndSecretRecipeId(member.getId(), secretRecipe.getId());
    if (newlyDiscovered) {
      secretRecipeDiscoveryRepository.save(SecretRecipeDiscovery.builder()
          .member(member)
          .secretRecipe(secretRecipe)
          .build());
    }
    return RecipeCreatedResponseDto.from(saved, baseName, extras.stream().map(Ingredient::getName).toList(), newlyDiscovered);
  }

  // 재료 선반. 손님에게 보이는 계열마다 기반 재료(판매 중 메뉴)와 열린 추가 재료 선반. 기반 재료가 하나도 없는 계열은 뺀다
  @Override
  public List<RecipeIngredientListResponseDto> getIngredients() {
    Map<Long, List<Menu>> menusByCategory = menuRepository.findAllForCustomer(null).stream()
        .filter(menu -> "on".equals(statusOf(menu)))
        .collect(Collectors.groupingBy(menu -> menu.getCategory().getId()));
    List<Ingredient> ingredients = ingredientRepository.findAllByVisibleTrueOrderByIdAsc();
    Map<String, Ingredient> basesByName = ingredients.stream()
        .filter(ingredient -> ingredient.getKind() == Ingredient.Kind.BASE)
        .collect(Collectors.toMap(Ingredient::getName, Function.identity()));
    Map<String, List<Ingredient>> extrasByShelf = ingredients.stream()
        .filter(ingredient -> ingredient.getKind() == Ingredient.Kind.EXTRA)
        .collect(Collectors.groupingBy(Ingredient::getShelf));

    return categoryRepository.findAllByOrderBySortOrderAscIdAsc().stream()
        .filter(category -> menusByCategory.containsKey(category.getId()))
        .map(category -> RecipeIngredientListResponseDto.from(
            category, menusByCategory.get(category.getId()), basesByName, extrasByShelf))
        .toList();
  }

  @Override
  public RecipeEmotionListResponseDto getEmotions() {
    return new RecipeEmotionListResponseDto(
        AlchemyRules.EMOTIONS.stream()
            .map(emotion -> new RecipeEmotionListResponseDto.Emotion(emotion.name(), emotion.color()))
            .toList(),
        AlchemyRules.TASTES);
  }

  // 감정 추천: 감정 일치 3점 + 맛 일치마다 2점. 판매 중 메뉴만, 점수 높은 순 4개 (같으면 메뉴판 순서)
  @Override
  public List<RecipeRecommendationResponseDto> getRecommendations(RecipeRecommendationRequestDto request) {
    String emotion = request.emotion() == null ? "" : request.emotion().trim();
    if (AlchemyRules.EMOTIONS.stream().noneMatch(item -> item.name().equals(emotion))) {
      throw new IllegalArgumentException("감정을 하나 고르세요. (피곤함, 열정, 그리움, 울적함, 설렘, 긴장됨)");
    }
    List<String> tastes = request.tasteList();
    tastes.stream()
        .filter(taste -> !AlchemyRules.TASTES.contains(taste))
        .findFirst()
        .ifPresent(taste -> {
          throw new IllegalArgumentException("알 수 없는 맛입니다: " + taste);
        });

    return menuRepository.findAllForCustomer(null).stream()
        .filter(menu -> "on".equals(statusOf(menu)))
        .map(menu -> RecipeRecommendationResponseDto.from(menu, score(menu, emotion, tastes)))
        .sorted(Comparator.comparingInt(RecipeRecommendationResponseDto::score).reversed())
        .limit(RECOMMENDATION_SIZE)
        .toList();
  }

  @Override
  public List<RecipeMenuListResponseDto> getMenus(RecipeMenuListRequestDto request) {
    return menuRepository.findAllForCustomer(request.categoryId()).stream()
        .map(RecipeMenuListResponseDto::from)
        .toList();
  }

  private int score(Menu menu, String emotion, List<String> tastes) {
    int emotionScore = menu.emotionTagList().contains(emotion) ? 3 : 0;
    List<String> menuTastes = menu.tasteTagList();
    return emotionScore + (int) tastes.stream().filter(menuTastes::contains).count() * 2;
  }

  // 고른 추가 재료를 읽고 조합 규칙을 검사한다. 같은 재료를 두 번 보내면 한 번으로 본다
  //   그 계열에 열린 선반의 재료여야 하고, 제외 재료 · 숨긴 재료는 안 된다
  //   선반마다 min~max 개, 티 블렌딩의 과일청 · 허브는 묶음마다 하나까지
  private List<Ingredient> findExtras(List<Long> extraIds, AlchemyRules.Line line) {
    List<Long> ids = extraIds.stream().distinct().toList();
    Map<Long, Ingredient> found = ingredientRepository.findAllById(ids).stream()
        .collect(Collectors.toMap(Ingredient::getId, Function.identity()));
    List<Ingredient> extras = ids.stream()
        .map(id -> {
          Ingredient extra = found.get(id);
          if (extra == null || extra.getKind() != Ingredient.Kind.EXTRA || !extra.isVisible()) {
            throw new IllegalArgumentException("고를 수 없는 추가 재료입니다: " + id);
          }
          if (!line.shelves().contains(extra.getShelf()) || line.excluded().contains(extra.getName())) {
            throw new IllegalArgumentException("이 계열에는 넣을 수 없는 재료입니다: " + extra.getName());
          }
          return extra;
        })
        .toList();

    Map<String, Long> countByShelf = extras.stream()
        .collect(Collectors.groupingBy(Ingredient::getShelf, Collectors.counting()));
    for (String shelf : line.shelves()) {
      AlchemyRules.Limit limit = AlchemyRules.limitOf(shelf);
      long count = countByShelf.getOrDefault(shelf, 0L);
      if (count < limit.min() || count > limit.max()) {
        throw new IllegalArgumentException(limit.min() > 0
            ? shelf + "는 " + limit.min() + "~" + limit.max() + "개 골라야 합니다."
            : shelf + "는 " + limit.max() + "개까지 고를 수 있습니다.");
      }
    }
    extras.stream()
        .map(AlchemyRules::groupOf)
        .filter(Objects::nonNull)
        .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
        .forEach((group, count) -> {
          if (count > 1) {
            throw new IllegalArgumentException(group + "은(는) 하나만 고를 수 있습니다.");
          }
        });
    return extras;
  }

  // 기반 재료와 추가 재료의 조합(정렬한 재료 id를 쉼표로 이은 값)이 비밀 레시피와 같으면 그 레시피 (손님 도감에서 숨긴 레시피는 빼고)
  // 기반 재료가 재료 테이블에 없는 메뉴는 비밀 레시피를 맞힐 수 없다
  private SecretRecipe findSecretRecipe(Ingredient base, List<Ingredient> extras) {
    if (base == null) {
      return null;
    }
    String combo = Stream.concat(Stream.of(base), extras.stream())
        .map(Ingredient::getId)
        .sorted()
        .map(String::valueOf)
        .collect(Collectors.joining(","));
    return secretRecipeRepository.findByIngredientCombo(combo)
        .filter(SecretRecipe::isVisible)
        .orElse(null);
  }

  private boolean isVisible(Category category) {
    return category != null && category.isVisible();
  }

  // status가 비어 있는 예전 메뉴는 "on"(판매중)으로 본다
  private String statusOf(Menu menu) {
    return menu.getStatus() != null ? menu.getStatus() : "on";
  }

  private Member findMember() {
    Long id = currentMember.id();
    return memberRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다: " + id));
  }
}
