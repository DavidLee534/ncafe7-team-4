package com.newcafe.backend.dto.showcase;

import java.time.LocalDateTime;

public record PotionShowcaseDetailResponseDto(Long id, String title, String nickname,
    String recipeName, String recipeGrade, String recipeColor, Double averageScore,
    Long ratingCount, LocalDateTime createdAt, String content, Long recipeId,
    Integer recipePrice, Integer myScore, boolean mine) {}
