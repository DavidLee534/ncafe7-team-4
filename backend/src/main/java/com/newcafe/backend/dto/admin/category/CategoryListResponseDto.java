package com.newcafe.backend.dto.admin.category;

import java.time.LocalDateTime;

import com.newcafe.backend.entity.Category;

// GET /api/v1/admin/categories, PATCH /api/v1/admin/categories/order 응답의 한 줄 (카테고리 목록)
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
// menuCount는 컬럼이 아니라 조회할 때 센 값. 0보다 크면 화면에서 삭제 버튼을 막는다
public record CategoryListResponseDto(
    Long id,
    String name,
    String engName,
    Integer sortOrder,
    boolean visible,
    long menuCount,
    LocalDateTime createdAt) {
  public static CategoryListResponseDto from(Category category, long menuCount) {
    return new CategoryListResponseDto(
        category.getId(),
        category.getName(),
        category.getEngName(),
        category.getSortOrder(),
        category.isVisible(),
        menuCount,
        category.getCreatedAt());
  }
}
