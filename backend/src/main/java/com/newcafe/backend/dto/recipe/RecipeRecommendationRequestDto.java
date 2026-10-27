package com.newcafe.backend.dto.recipe;

import java.util.Arrays;
import java.util.List;

// GET /api/v1/recipes/recommendations 조건 (?emotion=피곤함&tastes=달콤한,시원한)
// emotion 은 필수 (서비스에서 확인), tastes 는 쉼표로 이은 맛 이름이고 비워도 된다
public record RecipeRecommendationRequestDto(
    String emotion,
    String tastes
) {
  public List<String> tasteList() {
    if (tastes == null || tastes.isBlank()) {
      return List.of();
    }
    return Arrays.stream(tastes.split(",")).map(String::trim).filter(taste -> !taste.isEmpty()).toList();
  }
}
