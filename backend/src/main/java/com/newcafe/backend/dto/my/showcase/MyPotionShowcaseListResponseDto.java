package com.newcafe.backend.dto.my.showcase;

import java.time.LocalDateTime;

public record MyPotionShowcaseListResponseDto(Long id, String title, String recipeName,
    Double averageScore, LocalDateTime createdAt) {}
