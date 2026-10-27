package com.newcafe.backend.dto.recipe;

// GET /api/v1/recipes/menus 조건 (?categoryId=1). 비우면 전체
public record RecipeMenuListRequestDto(
    Long categoryId
) {
}
