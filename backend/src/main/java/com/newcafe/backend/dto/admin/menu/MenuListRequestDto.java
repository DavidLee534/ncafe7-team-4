package com.newcafe.backend.dto.admin.menu;

// GET /api/v1/admin/menus 검색 조건 (쿼리스트링 ?categoryId=1&status=on&keyword=라떼&ownerRecommended=true&sort=updatedAt&size=5)
// 모두 선택값이고, 비우면 그 조건으로 거르지 않는다. 아무것도 없으면 전체 목록
// keyword는 한글 이름과 영문 이름에서 대소문자 없이 찾는다
// sort=updatedAt이면 최근 수정순, 비우면 등록순(id). size를 비우면 개수 제한 없음
public record MenuListRequestDto(
    Long categoryId,
    String status,
    String keyword,
    Boolean ownerRecommended,
    String sort,
    Integer size
) {
}
