package com.newcafe.backend.dto.showcase;

import jakarta.validation.constraints.*;

public record PotionShowcaseCreateRequestDto(
    @NotNull Long recipeId,
    @NotBlank @Size(max = 50) String title,
    @Size(max = 2000) String content) {}
