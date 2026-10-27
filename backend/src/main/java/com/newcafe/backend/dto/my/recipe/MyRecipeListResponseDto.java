package com.newcafe.backend.dto.my.recipe;

import com.newcafe.backend.entity.Recipe;
import java.time.LocalDateTime;

// GET /api/v1/my/recipes 응답의 한 줄 (회원 도감 · 내가 빚은 포션)
// secret 은 비밀 레시피 조합을 맞혀서 만든 포션인지
public record MyRecipeListResponseDto(
    Long id,
    String name,
    String grade,
    Integer price,
    String color,
    Long baseMenuId,
    String baseMenuName,
    boolean secret,
    LocalDateTime createdAt
) {
  public static MyRecipeListResponseDto from(Recipe recipe) {
    return new MyRecipeListResponseDto(
        recipe.getId(),
        recipe.getName(),
        recipe.getGrade(),
        recipe.getPrice(),
        recipe.getColor(),
        recipe.getBaseMenu().getId(),
        recipe.getBaseMenu().getKorName(),
        recipe.getSecretRecipe() != null,
        recipe.getCreatedAt()
    );
  }
}
