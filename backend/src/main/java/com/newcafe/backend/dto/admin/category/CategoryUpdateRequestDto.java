package com.newcafe.backend.dto.admin.category;

// PUT /api/v1/admin/categories/{id} 요청 본문. 수정할 카테고리의 id는 경로에서 받는다
// sortOrder, visible을 비우면 기존 값을 그대로 둔다
public record CategoryUpdateRequestDto(
    String name,
    String engName,
    Integer sortOrder,
    Boolean visible
) {
}
