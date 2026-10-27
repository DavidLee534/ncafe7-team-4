package com.newcafe.backend.dto.admin.secretrecipe;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipe.Grade;

public record SecretRecipeDetailResponseDto(
    Long id, String name, String description, Grade grade,
    Long baseIngredientId, List<Long> ingredientIds, String riddle, String color,
    LocalDateTime createdAt, LocalDateTime updatedAt) {
  public static SecretRecipeDetailResponseDto from(SecretRecipe recipe) {
    return new SecretRecipeDetailResponseDto(
        recipe.getId(), recipe.getName(), recipe.getDescription(), recipe.getGrade(),
        recipe.getBaseIngredient() == null ? null : recipe.getBaseIngredient().getId(),
        recipe.getIngredientCombo() == null ? List.of()
            : Arrays.stream(recipe.getIngredientCombo().split(",")).map(Long::valueOf).toList(),
        recipe.getRiddle(), recipe.getColor(), recipe.getCreatedAt(), recipe.getUpdatedAt());
  }
}
