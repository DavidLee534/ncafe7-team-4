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
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.entity.Recipe;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipeDiscovery;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.MemberRepository;
import com.newcafe.backend.repository.MenuRepository;
import com.newcafe.backend.repository.RecipeRepository;
import com.newcafe.backend.repository.SecretRecipeDiscoveryRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfRecipeService implements RecipeService {

  // 선반이 정해지지 않은 새 계열(관리자가 추가한 카테고리)은 추가 재료 없이 기반 메뉴만 쓴다
  private static final AlchemyRules.Shelf DEFAULT_SHELF = new AlchemyRules.Shelf("비밀 물약", "#8a6a4f", List.of());
  private static final int RECOMMENDATION_SIZE = 4;

  private final CurrentMember currentMember;
  private final MemberRepository memberRepository;
  private final MenuRepository menuRepository;
  private final CategoryRepository categoryRepository;
  private final RecipeRepository recipeRepository;
  private final SecretRecipeRepository secretRecipeRepository;
  private final SecretRecipeDiscoveryRepository secretRecipeDiscoveryRepository;

  // 포션 만들기 → 도감 저장
  // 가격 = 기반 메뉴 가격 + 추가 재료 금액
  // 등급: 비밀 레시피 조합이면 legend, 추가 재료 2개 이상이면 rare, 아니면 normal
  // 비밀 레시피를 처음 맞히면 발견 기록(SecretRecipeDiscovery)도 남긴다
  @Override
  @Transactional
  public RecipeCreatedResponseDto create(RecipeCreateRequestDto request) {
    Member member = findMember();
    Menu baseMenu = menuRepository.findById(request.baseMenuId())
        .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + request.baseMenuId()));
    if (!"on".equals(statusOf(baseMenu)) || !isVisible(baseMenu.getCategory())) {
      throw new IllegalStateException("지금은 이 메뉴로 포션을 만들 수 없습니다: " + baseMenu.getKorName());
    }

    AlchemyRules.Shelf shelf = shelfOf(baseMenu.getCategory());
    List<String> extraNames = request.extrasOrEmpty().stream().map(String::trim).distinct().toList();
    List<AlchemyRules.Extra> extras = extraNames.stream()
        .map(name -> shelf.extras().stream()
            .filter(extra -> extra.name().equals(name))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("이 계열에 없는 추가 재료입니다: " + name)))
        .toList();

    SecretRecipe secretRecipe = findSecretRecipe(baseMenu, extraNames);
    int price = baseMenu.getPrice() + extras.stream().mapToInt(AlchemyRules.Extra::price).sum();
    String grade = secretRecipe != null ? "legend" : extras.size() >= 2 ? "rare" : "normal";
    String name = secretRecipe != null
        ? secretRecipe.getName()
        : extras.isEmpty() ? AlchemyRules.baseIngredientOf(baseMenu) + "의 " + shelf.spell() : extras.get(0).name() + " " + shelf.spell();

    Recipe saved = recipeRepository.save(Recipe.builder()
        .member(member)
        .baseMenu(baseMenu)
        .secretRecipe(secretRecipe)
        .name(name)
        .grade(grade)
        .price(price)
        .color(secretRecipe != null ? secretRecipe.getColor() : shelf.color())
        .build());

    boolean newlyDiscovered = secretRecipe != null
        && !secretRecipeDiscoveryRepository.existsByMemberIdAndSecretRecipeId(member.getId(), secretRecipe.getId());
    if (newlyDiscovered) {
      secretRecipeDiscoveryRepository.save(SecretRecipeDiscovery.builder()
          .member(member)
          .secretRecipe(secretRecipe)
          .build());
    }
    return RecipeCreatedResponseDto.from(saved, extraNames, newlyDiscovered);
  }

  // 재료 선반. 손님에게 보이는 계열마다 필수 재료(판매 중 메뉴)와 추가 재료. 필수 재료가 하나도 없는 계열은 뺀다
  @Override
  public List<RecipeIngredientListResponseDto> getIngredients() {
    Map<Long, List<Menu>> menusByCategory = menuRepository.findAllForCustomer(null).stream()
        .filter(menu -> "on".equals(statusOf(menu)))
        .collect(Collectors.groupingBy(menu -> menu.getCategory().getId()));

    return categoryRepository.findAllByOrderBySortOrderAscIdAsc().stream()
        .filter(category -> menusByCategory.containsKey(category.getId()))
        .map(category -> RecipeIngredientListResponseDto.from(
            category, shelfOf(category), menusByCategory.get(category.getId())))
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

  // 기반 메뉴와 추가 재료가 비밀 레시피 조합과 똑같으면 그 레시피 (손님 도감에서 숨긴 레시피는 빼고)
  private SecretRecipe findSecretRecipe(Menu baseMenu, List<String> extraNames) {
    Set<String> extras = Set.copyOf(extraNames);
    return AlchemyRules.SECRET_COMBOS.stream()
        .filter(combo -> combo.baseMenuSlug().equals(baseMenu.getSlug()) && combo.extras().equals(extras))
        .findFirst()
        .flatMap(combo -> secretRecipeRepository.findByName(combo.secretRecipeName()))
        .filter(SecretRecipe::isVisible)
        .orElse(null);
  }

  private AlchemyRules.Shelf shelfOf(Category category) {
    return category == null ? DEFAULT_SHELF : AlchemyRules.SHELVES.getOrDefault(category.getName(), DEFAULT_SHELF);
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
