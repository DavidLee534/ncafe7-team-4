package com.newcafe.backend.dto.admin.category;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

// PATCH /api/v1/admin/categories/order 요청 본문
// 카테고리 id를 화면에 보일 순서대로 담는다. 예: {"categoryIds": [3, 1, 2]} → 3번이 1번째
// 비어 있거나 null이 섞이면 400. 전체 카테고리를 빠짐없이 보냈는지는 서비스에서 확인한다(409)
public record CategoryOrderRequestDto(
    @NotEmpty(message = "카테고리 순서를 보내세요.")
    List<@NotNull(message = "카테고리 id가 비어 있습니다.") Long> categoryIds
) {
}
