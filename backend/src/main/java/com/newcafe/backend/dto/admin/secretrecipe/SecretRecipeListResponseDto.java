package com.newcafe.backend.dto.admin.secretrecipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import java.time.LocalDateTime;

// GET /api/v1/admin/secret-recipes 응답의 한 줄 (비밀 레시피 목록)
// 목록에는 긴 글(설명·수수께끼)을 빼고, 상세에서 받는다
// discoveryCount 는 컬럼이 아니라 조회할 때 센 값 (이 레시피를 발견한 회원 수)
public record SecretRecipeListResponseDto(
    Long id,
    String name,
    String grade,
    Long categoryId,
    String categoryName,
    String color,
    boolean visible,
    long discoveryCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
  public static SecretRecipeListResponseDto from(SecretRecipe recipe, long discoveryCount) {
    Category category = recipe.getCategory();
    return new SecretRecipeListResponseDto(
        recipe.getId(),
        recipe.getName(),
        recipe.getGrade(),
        category != null ? category.getId() : null,
        category != null ? category.getName() : null,
        recipe.getColor(),
        recipe.isVisible(),
        discoveryCount,
        recipe.getCreatedAt(),
        recipe.getUpdatedAt()
    );
  }
}
