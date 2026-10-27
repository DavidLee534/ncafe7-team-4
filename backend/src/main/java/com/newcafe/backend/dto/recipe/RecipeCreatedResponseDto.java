package com.newcafe.backend.dto.recipe;

import com.newcafe.backend.entity.Recipe;
import com.newcafe.backend.entity.SecretRecipe;
import java.time.LocalDateTime;
import java.util.List;

// POST /api/v1/recipes 응답 (도감에 저장된 포션)
// secretRecipeName 은 비밀 레시피를 맞혔을 때만 있고, newlyDiscovered 는 그 레시피를 이번에 처음 맞혔으면 true
// extras 는 넣은 추가 재료 이름 (이름 짓기와 같은 순서가 아니라 고른 순서)
public record RecipeCreatedResponseDto(
    Long id,
    String name,
    String grade,
    Integer price,
    String color,
    Long baseMenuId,
    String baseMenuName,
    String baseIngredientName,
    List<String> extras,
    String secretRecipeName,
    boolean newlyDiscovered,
    LocalDateTime createdAt
) {

  public static RecipeCreatedResponseDto from(Recipe recipe, String baseIngredientName, List<String> extras, boolean newlyDiscovered) {
    SecretRecipe secretRecipe = recipe.getSecretRecipe();
    return new RecipeCreatedResponseDto(
        recipe.getId(),
        recipe.getName(),
        recipe.getGrade(),
        recipe.getPrice(),
        recipe.getColor(),
        recipe.getBaseMenu().getId(),
        recipe.getBaseMenu().getKorName(),
        baseIngredientName,
        extras,
        secretRecipe != null ? secretRecipe.getName() : null,
        newlyDiscovered,
        recipe.getCreatedAt()
    );
  }
}
