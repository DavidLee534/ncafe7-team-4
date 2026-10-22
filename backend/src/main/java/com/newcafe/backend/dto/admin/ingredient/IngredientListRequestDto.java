package com.newcafe.backend.dto.admin.ingredient;

// GET /api/v1/admin/ingredients 검색 조건 (쿼리스트링 ?type=extra&shelf=시럽&keyword=바닐라)
// 모두 선택값이고, 비우면 그 조건으로 거르지 않는다. 아무것도 없으면 전체 목록
// keyword는 재료 이름과 수식어에서 대소문자 없이 찾는다
public record IngredientListRequestDto(
    String type,
    String shelf,
    String keyword
) {
}
