package com.newcafe.backend.dto.admin.menu;

// PUT /api/v1/admin/menus/{id} 요청 본문. 수정할 메뉴의 id는 경로에서 받는다
public record MenuUpdateRequestDto(
    String korName,
    String engName,
    Integer price
) {
}
