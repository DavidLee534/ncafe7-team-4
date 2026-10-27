package com.newcafe.backend.service.admin;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeCreateRequestDto;
import com.newcafe.backend.entity.Ingredient;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.repository.IngredientRepository;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.RecipeRepository;
import com.newcafe.backend.repository.SecretRecipeDiscoveryRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class DfSecretRecipeServiceTest {

  private final SecretRecipeRepository recipes = mock(SecretRecipeRepository.class);
  private final IngredientRepository ingredients = mock(IngredientRepository.class);
  private DfSecretRecipeService service;

  @BeforeEach
  void setUp() {
    service = new DfSecretRecipeService(recipes, mock(SecretRecipeDiscoveryRepository.class),
        mock(CategoryRepository.class), mock(RecipeRepository.class), ingredients);
  }

  @Test
  void createStoresIngredientIdsInStableOrder() {
    Ingredient base = ingredient(10L, Ingredient.Kind.BASE);
    Ingredient extra = ingredient(27L, Ingredient.Kind.EXTRA);
    when(ingredients.findAllById(List.of(27L, 10L))).thenReturn(List.of(extra, base));
    when(ingredients.getReferenceById(10L)).thenReturn(base);
    when(recipes.saveAndFlush(any(SecretRecipe.class))).thenAnswer(call -> call.getArgument(0));

    var result = service.create(request(List.of(27L, 10L)));

    ArgumentCaptor<SecretRecipe> saved = ArgumentCaptor.forClass(SecretRecipe.class);
    verify(recipes).saveAndFlush(saved.capture());
    assertEquals("10,27", saved.getValue().getIngredientCombo());
    assertEquals(List.of(10L, 27L), result.ingredientIds());
  }

  @Test
  void createRejectsRepeatedIngredientBeforeWriting() {
    assertThrows(IllegalArgumentException.class,
        () -> service.create(request(List.of(10L, 10L))));
    verifyNoInteractions(recipes, ingredients);
  }

  @Test
  void createRejectsAnExistingCombinationRegardlessOfInputOrder() {
    Ingredient base = ingredient(10L, Ingredient.Kind.BASE);
    Ingredient extra = ingredient(27L, Ingredient.Kind.EXTRA);
    when(ingredients.findAllById(List.of(27L, 10L))).thenReturn(List.of(base, extra));
    when(recipes.existsByIngredientCombo("10,27")).thenReturn(true);

    assertThrows(IllegalStateException.class,
        () -> service.create(request(List.of(27L, 10L))));
    verify(recipes, never()).saveAndFlush(any());
  }

  private SecretRecipeCreateRequestDto request(List<Long> ids) {
    return new SecretRecipeCreateRequestDto("빛과 어둠의 균형 포션", null,
        SecretRecipe.Grade.rare, 10L, ids, null, "#8a6a4f");
  }

  private Ingredient ingredient(Long id, Ingredient.Kind kind) {
    Ingredient ingredient = mock(Ingredient.class);
    when(ingredient.getId()).thenReturn(id);
    when(ingredient.getKind()).thenReturn(kind);
    return ingredient;
  }
}
