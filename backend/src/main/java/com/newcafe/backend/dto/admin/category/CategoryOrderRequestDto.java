package com.newcafe.backend.dto.admin.category;

import java.util.List;

// PATCH /api/v1/admin/categories/order 요청 본문
// 카테고리 id를 화면에 보일 순서대로 담는다. 예: {"categoryIds": [3, 1, 2]} → 3번이 1번째
public record CategoryOrderRequestDto(
    List<Long> categoryIds
) {
}
