package com.newcafe.backend.dto.admin.menu;

import com.newcafe.backend.entity.Menu;

// POST /api/v1/admin/menus 요청 본문. id는 DB가 정하므로 받지 않는다
public record MenuCreateRequestDto(
    String korName,
    String engName,
    Integer price
) {

  public Menu toEntity() {
    return Menu.builder()
        .korName(korName)
        .engName(engName)
        .price(price)
        .build();
  }
}
