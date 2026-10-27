package com.newcafe.backend.dto.admin.secretrecipe;

import jakarta.validation.constraints.*;
import java.util.List;

import com.newcafe.backend.entity.SecretRecipe.Grade;

public record SecretRecipeCreateRequestDto(
    @NotBlank @Size(max = 100) String name,
    @Size(max = 1000) String description,
    @NotNull Grade grade,
    @NotNull @Positive Long baseIngredientId,
    @NotNull @Size(min = 2, max = 20) List<@NotNull @Positive Long> ingredientIds,
    @Size(max = 1000) String riddle,
    @Pattern(regexp = "#[0-9a-fA-F]{6}") String color) {
}
