package com.newcafe.backend.dto.admin.menu;

import com.newcafe.backend.entity.Menu;

// 관리자 메뉴 API 응답 (목록·상세·생성·수정 공통). 엔티티를 그대로 내보내지 않으려고 둔다
public record MenuResponseDto(
    Long id,
    String korName,
    String engName,
    Integer price
) {

  public static MenuResponseDto from(Menu menu) {
    return new MenuResponseDto(
        menu.getId(),
        menu.getKorName(),
        menu.getEngName(),
        menu.getPrice()
    );
  }
}
