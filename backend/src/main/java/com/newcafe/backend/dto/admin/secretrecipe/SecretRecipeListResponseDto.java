package com.newcafe.backend.dto.admin.secretrecipe;

import java.time.LocalDateTime;

import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipe.Grade;

public record SecretRecipeListResponseDto(
    Long id, String name, Grade grade, String description,
    LocalDateTime createdAt, LocalDateTime updatedAt) {
  public static SecretRecipeListResponseDto from(SecretRecipe recipe) {
    return new SecretRecipeListResponseDto(recipe.getId(), recipe.getName(), recipe.getGrade(),
        recipe.getDescription(), recipe.getCreatedAt(), recipe.getUpdatedAt());
  }
}
