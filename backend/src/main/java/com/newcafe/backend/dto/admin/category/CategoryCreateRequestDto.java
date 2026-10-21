package com.newcafe.backend.dto.admin.category;

import com.newcafe.backend.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// POST /api/v1/admin/categories 요청 본문. id는 DB가 정하므로 받지 않는다
// sortOrder를 비우면 맨 뒤 순서, visible을 비우면 공개로 등록한다
// 검증에 실패하면 400 (컨트롤러의 @Valid)
public record CategoryCreateRequestDto(
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
  public Category toEntity(int defaultSortOrder) {
    return Category.builder()
        .name(name)
        .engName(engName)
        .sortOrder(sortOrder != null ? sortOrder : defaultSortOrder)
        .visible(visible == null || visible)
        .build();
  }
}
