package com.newcafe.backend.dto.admin.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// PUT /api/v1/admin/categories/{id} 요청 본문. 수정할 카테고리의 id는 경로에서 받는다
// sortOrder, visible을 비우면 기존 값을 그대로 둔다
// 검증에 실패하면 400 (컨트롤러의 @Valid)
public record CategoryUpdateRequestDto(
    @NotBlank(message = "카테고리 이름을 입력하세요.")
    @Size(max = 30, message = "카테고리 이름은 30자 이하로 입력하세요.")
    String name,

    @NotBlank(message = "영문 이름을 입력하세요.")
    @Size(max = 30, message = "영문 이름은 30자 이하로 입력하세요.")
    String engName,

    @Positive(message = "정렬 순서는 1 이상으로 입력하세요.")
    Integer sortOrder,

    Boolean visible
) {
}
