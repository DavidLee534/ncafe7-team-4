package com.newcafe.backend.dto.my.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record CartItemCreateRequestDto(Long menuId, Long recipeId,
    @Min(1) @Max(20) Integer quantity) {}
