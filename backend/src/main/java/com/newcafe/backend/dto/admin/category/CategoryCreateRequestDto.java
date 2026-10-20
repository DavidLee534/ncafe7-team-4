package com.newcafe.backend.dto.admin.category;

import com.newcafe.backend.entity.Category;

// POST /api/v1/admin/categories 요청 본문. id는 DB가 정하므로 받지 않는다
// sortOrder를 비우면 맨 뒤 순서, visible을 비우면 공개로 등록한다
public record CategoryCreateRequestDto(
    String name,
    String engName,
    Integer sortOrder,
    Boolean visible
) {
  public Category toEntity(int defaultSortOrder) {
    return Category.builder()
        .name(name)
        .engName(engName)
        .sortOrder(sortOrder != null ? sortOrder : defaultSortOrder)
        .visible(visible == null || visible)
        .build();
  }
}
