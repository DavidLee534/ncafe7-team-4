package com.newcafe.backend.dto.menu;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;

// GET /api/v1/menus · /menus/recommendations 응답의 한 줄 (손님 메뉴판)
// 사장 추천 · 등록일 같은 관리 정보는 넣지 않는다. status는 on 또는 soldout (숨김 메뉴는 오지 않는다)
public record MenuListResponseDto(
    Long id,
    String slug,
    String korName,
    String engName,
    Integer price,
    Long categoryId,
    String categoryName,
    String imageUrl,
    String status
) {
  public static MenuListResponseDto from(Menu menu) {
    Category category = menu.getCategory();
    return new MenuListResponseDto(
        menu.getId(),
        menu.getSlug(),
        menu.getKorName(),
        menu.getEngName(),
        menu.getPrice(),
        category.getId(),
        category.getName(),
        menu.getImageUrl(),
        menu.getStatus() != null ? menu.getStatus() : "on"
    );
  }
}
