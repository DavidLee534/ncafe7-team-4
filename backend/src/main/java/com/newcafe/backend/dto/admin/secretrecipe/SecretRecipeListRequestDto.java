package com.newcafe.backend.dto.admin.secretrecipe;

// GET /api/v1/admin/secret-recipes 검색 조건 (쿼리스트링 ?grade=legend&categoryId=1&keyword=황금)
// 모두 선택값이고, 비우면 그 조건으로 거르지 않는다. 아무것도 없으면 전체 목록
// keyword는 레시피 이름에서 대소문자 없이 찾는다
public record SecretRecipeListRequestDto(
    String grade,
    Long categoryId,
    String keyword
) {
}
