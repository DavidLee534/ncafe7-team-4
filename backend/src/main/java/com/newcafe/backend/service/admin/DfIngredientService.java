package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.ingredient.IngredientCreateRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientCreatedResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientDetailResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientListRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientListResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientUpdateRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientUpdatedResponseDto;
import com.newcafe.backend.entity.Ingredient;
import com.newcafe.backend.repository.IngredientRepository;
import com.newcafe.backend.repository.RecipeIngredientRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfIngredientService implements IngredientService {

  private final IngredientRepository ingredientRepository;
  private final RecipeIngredientRepository recipeIngredientRepository;
  private final SecretRecipeRepository secretRecipeRepository;

  // 같은 이름이 있으면 409
  @Override
  @Transactional
  public IngredientCreatedResponseDto create(IngredientCreateRequestDto request) {
    if (ingredientRepository.existsByName(request.name())) {
      throw new IllegalStateException("이미 있는 재료 이름입니다: " + request.name());
    }
    Ingredient saved = ingredientRepository.save(request.toEntity(
        modifierFor(request.type(), request.modifier()),
        modifierPriorityFor(request.type(), request.modifierPriority())));
    return IngredientCreatedResponseDto.from(saved);
  }

  // 빈 문자열 조건(?keyword=)은 조건 없음(null)으로 바꿔서 넘긴다
  @Override
  public List<IngredientListResponseDto> getList(IngredientListRequestDto request) {
    return ingredientRepository.findAllByCondition(
            blankToNull(request.type()),
            blankToNull(request.shelf()),
            blankToNull(request.keyword()))
        .stream()
        .map(IngredientListResponseDto::from)
        .toList();
  }

  @Override
  public IngredientDetailResponseDto getDetail(Long id) {
    return IngredientDetailResponseDto.from(findIngredient(id));
  }

  // 다른 재료와 이름이 겹치면 409
  @Override
  @Transactional
  public IngredientUpdatedResponseDto update(Long id, IngredientUpdateRequestDto request) {
    Ingredient ingredient = findIngredient(id);
    if (ingredientRepository.existsByNameAndIdNot(request.name(), id)) {
      throw new IllegalStateException("이미 있는 재료 이름입니다: " + request.name());
    }
    ingredient.update(
        request.name(),
        request.type(),
        request.shelf(),
        request.price(),
        request.color(),
        String.join(",", request.effectTags()),
        modifierFor(request.type(), request.modifier()),
        modifierPriorityFor(request.type(), request.modifierPriority()),
        request.visible() != null ? request.visible() : ingredient.isVisible());
    return IngredientUpdatedResponseDto.from(ingredient);
  }

  // 회원 포션이나 비밀 레시피 조합에 쓰인 재료는 지울 수 없다(409) → 대신 숨김(visible=false)으로 바꾼다
  // 지우면 도감의 포션 재료와 비밀 레시피 조합이 가리킬 재료가 사라지기 때문
  @Override
  @Transactional
  public void delete(Long id) {
    Ingredient ingredient = findIngredient(id);
    if (recipeIngredientRepository.existsByIngredientId(id) || usedBySecretRecipe(id)) {
      throw new IllegalStateException("포션이나 비밀 레시피에 쓰인 재료는 삭제할 수 없습니다. 숨김으로 바꾸세요: " + ingredient.getName());
    }
    ingredientRepository.delete(ingredient);
  }

  // 비밀 레시피의 기반 재료이거나 재료 조합(쉼표로 이은 id)에 들어 있는지
  private boolean usedBySecretRecipe(Long id) {
    String target = String.valueOf(id);
    return secretRecipeRepository.existsByBaseIngredientId(id)
        || secretRecipeRepository.findAllIngredientCombos().stream()
            .anyMatch(combo -> Arrays.asList(combo.split(",")).contains(target));
  }

  // 없는 id면 NotFoundException(404)
  private Ingredient findIngredient(Long id) {
    return ingredientRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("재료를 찾을 수 없습니다: " + id));
  }

  // 수식어는 추가 재료에만 붙는다. 기반 재료이거나 비워 보내면 null
  private String modifierFor(String type, String modifier) {
    return "extra".equals(type) ? blankToNull(modifier) : null;
  }

  private Integer modifierPriorityFor(String type, Integer modifierPriority) {
    return "extra".equals(type) ? modifierPriority : null;
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }
}
