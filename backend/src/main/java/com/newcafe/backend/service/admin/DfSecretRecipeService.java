package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeCategoryListResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeCreateRequestDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeCreatedResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeDetailResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeDiscoveryListResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeListRequestDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeListResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeSummaryResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeUpdateRequestDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeUpdatedResponseDto;
import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.RecipeRepository;
import com.newcafe.backend.repository.SecretRecipeDiscoveryRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfSecretRecipeService implements SecretRecipeService {

  private final SecretRecipeRepository secretRecipeRepository;
  private final SecretRecipeDiscoveryRepository discoveryRepository;
  private final CategoryRepository categoryRepository;
  private final RecipeRepository recipeRepository;

  // 같은 이름이 있으면 409
  @Override
  @Transactional
  public SecretRecipeCreatedResponseDto create(SecretRecipeCreateRequestDto request) {
    if (secretRecipeRepository.existsByName(request.name().trim())) {
      throw new IllegalStateException("이미 있는 비밀 레시피 이름입니다: " + request.name().trim());
    }
    Category category = findCategory(request.categoryId());
    SecretRecipe saved = secretRecipeRepository.save(request.toEntity(category));
    return SecretRecipeCreatedResponseDto.from(saved, 0);
  }

  // 빈 문자열 조건(?keyword=)은 조건 없음(null)으로 바꿔서 넘긴다
  // 발견 횟수는 레시피마다 세지 않고 group by 쿼리 한 번으로 센다 (N+1 방지)
  @Override
  public List<SecretRecipeListResponseDto> getList(SecretRecipeListRequestDto request) {
    Map<Long, Long> discoveryCounts = countDiscoveries();
    return secretRecipeRepository.findAllByCondition(
            blankToNull(request.grade()),
            request.categoryId(),
            blankToNull(request.keyword()))
        .stream()
        .map(recipe -> SecretRecipeListResponseDto.from(
            recipe, discoveryCounts.getOrDefault(recipe.getId(), 0L)))
        .toList();
  }

  @Override
  public SecretRecipeDetailResponseDto getDetail(Long id) {
    SecretRecipe recipe = findSecretRecipe(id);
    return SecretRecipeDetailResponseDto.from(recipe, discoveryRepository.countBySecretRecipeId(id));
  }

  // 목록 상단의 개수: 전체·희귀·전설 레시피 수와 모든 발견 기록 수
  @Override
  public SecretRecipeSummaryResponseDto getSummary() {
    return new SecretRecipeSummaryResponseDto(
        secretRecipeRepository.count(),
        secretRecipeRepository.countByGrade("rare"),
        secretRecipeRepository.countByGrade("legend"),
        discoveryRepository.count());
  }

  // 등록·수정 화면의 계열 선택 상자. 화면 순서(sortOrder)대로
  @Override
  public List<SecretRecipeCategoryListResponseDto> getCategories() {
    return categoryRepository.findAllByOrderBySortOrderAscIdAsc().stream()
        .map(SecretRecipeCategoryListResponseDto::from)
        .toList();
  }

  // 이 레시피를 발견한 회원 목록 (최근 발견순). 없는 레시피면 404
  @Override
  public List<SecretRecipeDiscoveryListResponseDto> getDiscoveries(Long id) {
    findSecretRecipe(id);
    return discoveryRepository.findAllBySecretRecipeIdWithMember(id).stream()
        .map(SecretRecipeDiscoveryListResponseDto::from)
        .toList();
  }

  // 조회한 레시피의 값을 바꾸면 트랜잭션이 끝날 때 UPDATE 된다
  // 다른 레시피와 이름이 같으면 409. visible을 비우면 기존 값 유지
  @Override
  @Transactional
  public SecretRecipeUpdatedResponseDto update(Long id, SecretRecipeUpdateRequestDto request) {
    SecretRecipe recipe = findSecretRecipe(id);
    String name = request.name().trim();
    if (secretRecipeRepository.existsByNameAndIdNot(name, id)) {
      throw new IllegalStateException("이미 있는 비밀 레시피 이름입니다: " + name);
    }
    recipe.update(
        name,
        request.grade(),
        findCategory(request.categoryId()),
        request.color(),
        request.description(),
        request.riddle(),
        request.visible() != null ? request.visible() : recipe.isVisible());
    return SecretRecipeUpdatedResponseDto.from(recipe, discoveryRepository.countBySecretRecipeId(id));
  }

  // 회원이 이미 발견했거나 이 레시피로 만든 포션이 있으면 지울 수 없다(409) → 대신 숨김(visible=false)으로 바꾼다
  // 지우면 손님 도감의 발견 기록과 포션이 가리킬 레시피가 사라지기 때문
  @Override
  @Transactional
  public void delete(Long id) {
    SecretRecipe recipe = findSecretRecipe(id);
    if (discoveryRepository.existsBySecretRecipeId(id) || recipeRepository.existsBySecretRecipeId(id)) {
      throw new IllegalStateException("손님이 이미 발견한 비밀 레시피는 삭제할 수 없습니다. 숨김으로 바꾸세요: " + recipe.getName());
    }
    secretRecipeRepository.delete(recipe);
  }

  // 레시피 id → 발견 횟수
  private Map<Long, Long> countDiscoveries() {
    Map<Long, Long> counts = new HashMap<>();
    for (Object[] row : discoveryRepository.countGroupBySecretRecipe()) {
      counts.put((Long) row[0], (Long) row[1]);
    }
    return counts;
  }

  // 없는 id면 NotFoundException(404)
  private SecretRecipe findSecretRecipe(Long id) {
    return secretRecipeRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("비밀 레시피를 찾을 수 없습니다: " + id));
  }

  // 없는 id면 NotFoundException(404). 등록·수정 요청은 categoryId가 필수라(@NotNull) null은 들어오지 않는다
  private Category findCategory(Long categoryId) {
    return categoryRepository.findById(categoryId)
        .orElseThrow(() -> new NotFoundException("카테고리를 찾을 수 없습니다: " + categoryId));
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }
}
