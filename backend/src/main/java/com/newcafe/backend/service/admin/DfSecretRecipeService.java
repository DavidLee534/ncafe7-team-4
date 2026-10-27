package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.secretrecipe.*;
import com.newcafe.backend.entity.Ingredient;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipe.Grade;
import com.newcafe.backend.repository.IngredientRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfSecretRecipeService implements SecretRecipeService {

  private final SecretRecipeRepository recipeRepository;
  private final IngredientRepository ingredientRepository;

  @Override
  public List<SecretRecipeListResponseDto> getList() {
    return recipeRepository.findAllByOrderByIdDesc().stream()
        .map(SecretRecipeListResponseDto::from).toList();
  }

  @Override
  @Transactional
  public SecretRecipeDetailResponseDto create(SecretRecipeCreateRequestDto request) {
    String combo = normalizeAndValidate(request.baseIngredientId(), request.ingredientIds());
    if (recipeRepository.existsByIngredientCombo(combo)) {
      throw duplicateCombo();
    }
    Ingredient base = ingredientRepository.getReferenceById(request.baseIngredientId());
    SecretRecipe recipe = new SecretRecipe(request.name(), request.description(), request.grade(),
        base, combo, request.riddle(), request.color());
    try {
      return SecretRecipeDetailResponseDto.from(recipeRepository.saveAndFlush(recipe));
    } catch (DataIntegrityViolationException e) {
      throw duplicateCombo();
    }
  }

  @Override
  public SecretRecipeDetailResponseDto getDetail(Long id) {
    return SecretRecipeDetailResponseDto.from(findRecipe(id));
  }

  @Override
  @Transactional
  public SecretRecipeDetailResponseDto update(Long id, SecretRecipeUpdateRequestDto request) {
    SecretRecipe recipe = findRecipe(id);
    String combo = normalizeAndValidate(request.baseIngredientId(), request.ingredientIds());
    if (recipeRepository.existsByIngredientComboAndIdNot(combo, id)) {
      throw duplicateCombo();
    }
    Ingredient base = ingredientRepository.getReferenceById(request.baseIngredientId());
    recipe.update(request.name(), request.description(), request.grade(), base, combo,
        request.riddle(), request.color());
    try {
      recipeRepository.flush();
    } catch (DataIntegrityViolationException e) {
      throw duplicateCombo();
    }
    return SecretRecipeDetailResponseDto.from(recipe);
  }

  @Override
  @Transactional
  public void delete(Long id) {
    recipeRepository.delete(findRecipe(id));
  }

  private SecretRecipe findRecipe(Long id) {
    return recipeRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("비밀 레시피를 찾을 수 없습니다: " + id));
  }

  private String normalizeAndValidate(Long baseId, List<Long> ids) {
    if (baseId == null || ids == null || ids.size() < 2 || ids.size() > 20
        || ids.stream().anyMatch(id -> id == null || id <= 0) || baseId <= 0) {
      throw new IllegalArgumentException("재료 ID는 2개 이상 20개 이하로 입력하세요.");
    }
    if (new HashSet<>(ids).size() != ids.size() || !ids.contains(baseId)) {
      throw new IllegalArgumentException("기반 재료를 포함해 서로 다른 재료 ID를 입력하세요.");
    }
    Map<Long, Ingredient> ingredients = ingredientRepository.findAllById(ids).stream()
        .collect(Collectors.toMap(Ingredient::getId, Function.identity()));
    if (ingredients.size() != ids.size()) {
      throw new IllegalArgumentException("존재하지 않는 재료 ID가 있습니다.");
    }
    if (ingredients.get(baseId).getKind() != Ingredient.Kind.BASE
        || ids.stream().filter(id -> !id.equals(baseId))
            .anyMatch(id -> ingredients.get(id).getKind() != Ingredient.Kind.EXTRA)) {
      throw new IllegalArgumentException("기반 재료 1개와 추가 재료를 선택하세요.");
    }
    return ids.stream().sorted().map(String::valueOf).collect(Collectors.joining(","));
  }

  private IllegalStateException duplicateCombo() {
    return new IllegalStateException("이미 등록된 재료 조합입니다.");
  }
}
