package com.newcafe.backend.dto.my.cart;

public record CartItemCreatedResponseDto(Long id, Long menuId, Long recipeId,
    String name, Integer unitPrice, Integer quantity) {}
