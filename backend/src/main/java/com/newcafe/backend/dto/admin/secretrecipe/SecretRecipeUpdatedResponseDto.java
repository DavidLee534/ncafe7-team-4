package com.newcafe.backend.dto.admin.secretrecipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import java.time.LocalDateTime;

// PUT /api/v1/admin/secret-recipes/{id} 응답 (수정된 레시피)
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
// 계열이 없는 레시피는 categoryId, categoryName이 null
public record SecretRecipeUpdatedResponseDto(
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
  public static SecretRecipeUpdatedResponseDto from(SecretRecipe recipe, long discoveryCount) {
    Category category = recipe.getCategory();
    return new SecretRecipeUpdatedResponseDto(
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
