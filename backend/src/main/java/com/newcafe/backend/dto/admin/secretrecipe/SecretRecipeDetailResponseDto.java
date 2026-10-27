package com.newcafe.backend.dto.admin.secretrecipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import java.time.LocalDateTime;

// GET /api/v1/admin/secret-recipes/{id} 응답 (비밀 레시피 상세 · 수정 화면의 기존 값). discoveryCount 는 발견한 회원 수
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
// 계열이 없는 레시피는 categoryId, categoryName이 null
public record SecretRecipeDetailResponseDto(
    Long id,
    String name,
    String grade,
    Long categoryId,
    String categoryName,
    String color,
    String description,
    String riddle,
    boolean visible,
    long discoveryCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
  public static SecretRecipeDetailResponseDto from(SecretRecipe recipe, long discoveryCount) {
    Category category = recipe.getCategory();
    return new SecretRecipeDetailResponseDto(
        recipe.getId(),
        recipe.getName(),
        recipe.getGrade(),
        category != null ? category.getId() : null,
        category != null ? category.getName() : null,
        recipe.getColor(),
        recipe.getDescription(),
        recipe.getRiddle(),
        recipe.isVisible(),
        discoveryCount,
        recipe.getCreatedAt(),
        recipe.getUpdatedAt()
    );
  }
}
