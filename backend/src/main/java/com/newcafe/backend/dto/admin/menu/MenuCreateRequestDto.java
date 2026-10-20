package com.newcafe.backend.dto.admin.menu;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;

// POST /api/v1/admin/menus 요청 본문. id는 DB가 정하므로 받지 않는다
// categoryId는 서비스에서 Category로 찾아 넘긴다 (비우면 카테고리 없음)
// status를 비우면 "on"(판매중), ownerRecommended를 비우면 false
public record MenuCreateRequestDto(
    String korName,
    String engName,
    Integer price,
    Long categoryId,
    String description,
    String status,
    Boolean ownerRecommended
) {
  public Menu toEntity(Category category) {
    return Menu.builder()
        .korName(korName)
        .engName(engName)
        .price(price)
        .category(category)
        .description(description)
        .status(status != null ? status : "on")
        .ownerRecommended(Boolean.TRUE.equals(ownerRecommended))
        .build();
  }
}
