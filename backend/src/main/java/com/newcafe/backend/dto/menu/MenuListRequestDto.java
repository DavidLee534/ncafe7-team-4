package com.newcafe.backend.dto.menu;

// GET /api/v1/menus 검색 조건 (?categoryId=1&keyword=라떼). 모두 선택값이고 비우면 전체
// keyword는 한글 이름과 영문 이름에서 대소문자 없이 찾는다
public record MenuListRequestDto(
    Long categoryId,
    String keyword
) {
}
