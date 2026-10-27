package com.newcafe.backend.dto.showcase;

import java.time.LocalDateTime;

public record PotionShowcaseListResponseDto(Long id, String title, String nickname,
    String recipeName, String recipeGrade, String recipeColor, Double averageScore,
    Long ratingCount, LocalDateTime createdAt) {}
