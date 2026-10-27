package com.newcafe.backend.dto.admin.secretrecipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

// POST /api/v1/admin/secret-recipes 응답 (등록된 레시피. id · 등록일처럼 서버가 채운 값 포함). 막 만든 레시피라 discoveryCount 는 0
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
// 계열이 없는 레시피는 categoryId, categoryName이 null
public record SecretRecipeCreatedResponseDto(
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
    LocalDateTime updatedAt,
    List<Long> ingredientIds
) {
  public static SecretRecipeCreatedResponseDto from(SecretRecipe recipe, long discoveryCount) {
    Category category = recipe.getCategory();
    return new SecretRecipeCreatedResponseDto(
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
        recipe.getUpdatedAt(),
        recipe.getIngredientCombo() == null ? List.of() : Arrays.stream(recipe.getIngredientCombo().split(","))
            .map(Long::valueOf).toList()
    );
  }
}
