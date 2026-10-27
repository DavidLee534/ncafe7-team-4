package com.newcafe.backend.dto.recipe;

import com.newcafe.backend.entity.Menu;
import java.util.List;

// GET /api/v1/recipes/recommendations 응답의 한 줄 (추천 메뉴, 점수 높은 순)
// score 는 감정 일치 3점 + 맛 일치마다 2점
public record RecipeRecommendationResponseDto(
    Long menuId,
    String slug,
    String korName,
    String engName,
    String categoryName,
    Integer price,
    String imageUrl,
    String description,
    List<String> emotionTags,
    List<String> tasteTags,
    int score
) {
  public static RecipeRecommendationResponseDto from(Menu menu, int score) {
    return new RecipeRecommendationResponseDto(
        menu.getId(),
        menu.getSlug(),
        menu.getKorName(),
        menu.getEngName(),
        menu.getCategory() != null ? menu.getCategory().getName() : null,
        menu.getPrice(),
        menu.getImageUrl(),
        menu.getDescription(),
        menu.emotionTagList(),
        menu.tasteTagList(),
        score
    );
  }
}
