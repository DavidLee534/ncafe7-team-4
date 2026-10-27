package com.newcafe.backend.dto.my.recipe;

import java.time.LocalDateTime;

public record MyRecipeListResponseDto(Long id, String name, String grade, Integer price,
    String color, String baseMenuName, LocalDateTime createdAt) {}
