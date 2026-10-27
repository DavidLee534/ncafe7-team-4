package com.newcafe.backend.dto.recipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import java.util.List;

// GET /api/v1/recipes/menus 응답의 한 줄 (기본 메뉴 고르기)
// 숨김 메뉴는 오지 않는다. 품절(soldout) 메뉴는 오지만 화면에서 담기를 막는다
public record RecipeMenuListResponseDto(
    Long menuId,
    String slug,
    String korName,
    String engName,
    Long categoryId,
    String categoryName,
    Integer price,
    String imageUrl,
    String description,
    String status,
    List<String> emotionTags,
    List<String> tasteTags
) {
  public static RecipeMenuListResponseDto from(Menu menu) {
    Category category = menu.getCategory();
    return new RecipeMenuListResponseDto(
        menu.getId(),
        menu.getSlug(),
        menu.getKorName(),
        menu.getEngName(),
        category != null ? category.getId() : null,
        category != null ? category.getName() : null,
        menu.getPrice(),
        menu.getImageUrl(),
        menu.getDescription(),
        menu.getStatus() != null ? menu.getStatus() : "on",
        menu.emotionTagList(),
        menu.tasteTagList()
    );
  }
}
