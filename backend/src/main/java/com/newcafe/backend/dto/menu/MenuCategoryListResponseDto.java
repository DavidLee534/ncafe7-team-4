package com.newcafe.backend.dto.menu;

import com.newcafe.backend.entity.Category;

// GET /api/v1/menus/categories 응답의 한 줄 (손님 메뉴판의 카테고리 탭)
// 숨긴 카테고리는 오지 않는다. menuCount는 손님에게 보이는 메뉴 수 (컬럼이 아니라 조회할 때 센 값)
public record MenuCategoryListResponseDto(
    Long id,
    String name,
    String engName,
    long menuCount
) {
  public static MenuCategoryListResponseDto from(Category category, long menuCount) {
    return new MenuCategoryListResponseDto(
        category.getId(),
        category.getName(),
        category.getEngName(),
        menuCount
    );
  }
}
