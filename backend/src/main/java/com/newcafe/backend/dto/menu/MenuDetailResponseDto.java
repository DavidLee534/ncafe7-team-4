package com.newcafe.backend.dto.menu;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import java.util.List;

// GET /api/v1/menus/{slug} 응답 (손님 메뉴 상세). 목록 값 + 설명 · 감정/맛 태그
public record MenuDetailResponseDto(
    Long id,
    String slug,
    String korName,
    String engName,
    Integer price,
    Long categoryId,
    String categoryName,
    String imageUrl,
    String status,
    String description,
    List<String> emotionTags,
    List<String> tasteTags
) {
  public static MenuDetailResponseDto from(Menu menu) {
    Category category = menu.getCategory();
    return new MenuDetailResponseDto(
        menu.getId(),
        menu.getSlug(),
        menu.getKorName(),
        menu.getEngName(),
        menu.getPrice(),
        category.getId(),
        category.getName(),
        menu.getImageUrl(),
        menu.getStatus() != null ? menu.getStatus() : "on",
        menu.getDescription(),
        menu.emotionTagList(),
        menu.tasteTagList()
    );
  }
}
