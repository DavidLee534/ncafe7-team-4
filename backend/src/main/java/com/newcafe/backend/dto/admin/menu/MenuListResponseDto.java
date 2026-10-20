package com.newcafe.backend.dto.admin.menu;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import java.time.LocalDateTime;

// GET /api/v1/admin/menus 응답의 한 줄 (메뉴 목록)
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
// 카테고리가 없는 메뉴는 categoryId, categoryName이 null. status가 비어 있으면 "on"(판매중)
public record MenuListResponseDto(
    Long id,
    String korName,
    String engName,
    Integer price,
    Long categoryId,
    String categoryName,
    String description,
    String imageUrl,
    String status,
    boolean ownerRecommended,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
  public static MenuListResponseDto from(Menu menu) {
    Category category = menu.getCategory();
    return new MenuListResponseDto(
        menu.getId(),
        menu.getKorName(),
        menu.getEngName(),
        menu.getPrice(),
        category != null ? category.getId() : null,
        category != null ? category.getName() : null,
        menu.getDescription(),
        menu.getImageUrl(),
        menu.getStatus() != null ? menu.getStatus() : "on",
        menu.isOwnerRecommended(),
        menu.getCreatedAt(),
        menu.getUpdatedAt()
    );
  }
}
