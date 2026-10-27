package com.newcafe.backend.dto.admin.ingredient;

import com.newcafe.backend.entity.Ingredient;
import java.time.LocalDateTime;
import java.util.List;

// POST /api/v1/admin/ingredients 응답 (등록된 재료)
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
public record IngredientCreatedResponseDto(
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
  public static IngredientCreatedResponseDto from(Ingredient ingredient) {
    return new IngredientCreatedResponseDto(
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
