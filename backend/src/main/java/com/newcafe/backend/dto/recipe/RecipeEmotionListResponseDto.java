package com.newcafe.backend.dto.recipe;

import java.util.List;

// GET /api/v1/recipes/emotions 응답 (감정 연금술의 감정 · 맛 목록)
public record RecipeEmotionListResponseDto(
    List<Emotion> emotions,
    List<String> tastes
) {
  public record Emotion(String name, String color) {
  }
}
