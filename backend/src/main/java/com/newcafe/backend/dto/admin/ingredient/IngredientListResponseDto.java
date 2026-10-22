package com.newcafe.backend.dto.admin.ingredient;

import com.newcafe.backend.entity.Ingredient;
import java.time.LocalDateTime;
import java.util.List;

// GET /api/v1/admin/ingredients 응답의 한 줄 (재료 목록)
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
public record IngredientListResponseDto(
    Long id,
    String name,
    String type,
    String shelf,
    Integer price,
    String color,
    List<String> effectTags,
    String modifier,
    Integer modifierPriority,
    boolean visible,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
  public static IngredientListResponseDto from(Ingredient ingredient) {
    return new IngredientListResponseDto(
        ingredient.getId(),
        ingredient.getName(),
        ingredient.getType(),
        ingredient.getShelf(),
        ingredient.getPrice(),
        ingredient.getColor(),
        ingredient.effectTagList(),
        ingredient.getModifier(),
        ingredient.getModifierPriority(),
        ingredient.isVisible(),
        ingredient.getCreatedAt(),
        ingredient.getUpdatedAt()
    );
  }
}
