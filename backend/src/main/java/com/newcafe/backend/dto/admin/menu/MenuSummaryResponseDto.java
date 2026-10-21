package com.newcafe.backend.dto.admin.menu;

// GET /api/v1/admin/menus/summary 응답 (메뉴 목록 상단의 상태별 개수, 모카 메시지)
// 검색 조건과 상관없이 센다. ?categoryId=가 있으면 그 카테고리 안에서만 센다
public record MenuSummaryResponseDto(
    long all,
    long on,
    long soldout,
    long hidden
) {
}
