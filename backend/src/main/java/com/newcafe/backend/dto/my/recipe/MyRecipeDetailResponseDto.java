package com.newcafe.backend.dto.my.recipe;

import com.newcafe.backend.entity.Recipe;
import java.time.LocalDateTime;
import java.util.List;

// GET /api/v1/my/recipes/{id} 응답 (회원 도감 · 내 포션 상세)
// 목록 값 + 기반 메뉴 설명, 맞힌 비밀 레시피 이름(없으면 null), 넣은 재료 이름(기반 재료 먼저)
public record MyRecipeDetailResponseDto(
    Long id,
    String name,
    String grade,
    Integer price,
    String color,
    Long baseMenuId,
    String baseMenuName,
    String baseMenuDescription,
    String secretRecipeName,
    List<String> ingredients,
    LocalDateTime createdAt
) {
  public static MyRecipeDetailResponseDto from(Recipe recipe, List<String> ingredients) {
    return new MyRecipeDetailResponseDto(
        recipe.getId(),
        recipe.getName(),
        recipe.getGrade(),
        recipe.getPrice(),
        recipe.getColor(),
        recipe.getBaseMenu().getId(),
        recipe.getBaseMenu().getKorName(),
        recipe.getBaseMenu().getDescription(),
        recipe.getSecretRecipe() != null ? recipe.getSecretRecipe().getName() : null,
        ingredients,
        recipe.getCreatedAt()
    );
  }
}
