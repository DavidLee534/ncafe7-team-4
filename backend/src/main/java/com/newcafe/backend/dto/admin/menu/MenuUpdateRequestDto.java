package com.newcafe.backend.dto.admin.menu;

// PUT /api/v1/admin/menus/{id} 요청 본문. 수정할 메뉴의 id는 경로에서 받는다
// 이미지(imageUrl)와 인기(popular)는 아직 화면에서 바꾸지 않아서 받지 않고 기존 값을 유지한다
public record MenuUpdateRequestDto(
    String korName,
    String engName,
    Integer price,
    Long categoryId,
    String description,
    String status,
    Boolean ownerRecommended
) {
}
