package com.newcafe.backend.dto.recipe;

import com.newcafe.backend.entity.Recipe;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.service.AlchemyRules;
import java.time.LocalDateTime;
import java.util.List;

// POST /api/v1/recipes 응답 (도감에 저장된 포션)
// secretRecipeName 은 비밀 레시피를 맞혔을 때만 있고, newlyDiscovered 는 그 레시피를 이번에 처음 맞혔으면 true
// extras 는 테이블에 저장하지 않으므로 요청에서 받은 재료를 그대로 돌려준다 (재료 관리 머지 후 RecipeIngredient 로)
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
  public static RecipeCreatedResponseDto from(Recipe recipe, List<String> extras, boolean newlyDiscovered) {
    SecretRecipe secretRecipe = recipe.getSecretRecipe();
    return new RecipeCreatedResponseDto(
        recipe.getId(),
        recipe.getName(),
        recipe.getGrade(),
        recipe.getPrice(),
        recipe.getColor(),
        recipe.getBaseMenu().getId(),
        recipe.getBaseMenu().getKorName(),
        AlchemyRules.baseIngredientOf(recipe.getBaseMenu()),
        extras,
        secretRecipe != null ? secretRecipe.getName() : null,
        newlyDiscovered,
        recipe.getCreatedAt()
    );
  }
}
