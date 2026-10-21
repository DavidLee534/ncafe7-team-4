package com.newcafe.backend.dto.admin.menu;

import com.newcafe.backend.entity.Category;

// GET /api/v1/admin/menus/categories 응답의 한 줄 (메뉴 화면의 카테고리 칩·선택 상자)
// 메뉴 화면에 필요한 값만 담는다. 정렬 순서·공개 여부 같은 관리 정보는 카테고리 관리 API에서 받는다
// menuCount는 컬럼이 아니라 조회할 때 센 값
public record MenuCategoryListResponseDto(
    Long id,
    String name,
    long menuCount
) {
  public static MenuCategoryListResponseDto from(Category category, long menuCount) {
    return new MenuCategoryListResponseDto(
        category.getId(),
        category.getName(),
        menuCount
    );
  }
}
