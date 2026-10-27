package com.newcafe.backend.dto.admin.secretrecipe;

import com.newcafe.backend.entity.Category;

// GET /api/v1/admin/secret-recipes/categories 응답의 한 줄 (등록·수정 화면의 계열 선택 상자)
// 선택에 필요한 값만 담는다. 정렬 순서·공개 여부 같은 관리 정보는 카테고리 관리 API에서 받는다
public record SecretRecipeCategoryListResponseDto(
    Long id,
    String name
) {
  public static SecretRecipeCategoryListResponseDto from(Category category) {
    return new SecretRecipeCategoryListResponseDto(category.getId(), category.getName());
  }
}
