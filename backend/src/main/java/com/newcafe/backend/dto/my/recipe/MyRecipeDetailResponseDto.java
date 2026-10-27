package com.newcafe.backend.dto.my.recipe;

import com.newcafe.backend.entity.Recipe;
import java.time.LocalDateTime;

// GET /api/v1/my/recipes/{id} 응답 (회원 도감 · 내 포션 상세)
// 목록 값 + 기반 메뉴 설명, 맞힌 비밀 레시피 이름(없으면 null). 재료 조합은 재료 관리 머지 후 추가
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
    LocalDateTime createdAt
) {
  public static MyRecipeDetailResponseDto from(Recipe recipe) {
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
        recipe.getCreatedAt()
    );
  }
}
