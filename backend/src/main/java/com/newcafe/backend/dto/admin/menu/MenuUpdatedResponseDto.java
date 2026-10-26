package com.newcafe.backend.dto.admin.menu;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import java.time.LocalDateTime;
import java.util.List;

// PUT /api/v1/admin/menus/{id} 응답 (수정된 메뉴)
// 지금은 다른 응답과 필드가 같지만, 화면마다 따로 바뀔 수 있게 나눠 둔다
// 카테고리가 없는 메뉴는 categoryId, categoryName이 null. status가 비어 있으면 "on"(판매중)
public record MenuUpdatedResponseDto(
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
    String slug,
    List<String> emotionTags,
    List<String> tasteTags,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
  public static MenuUpdatedResponseDto from(Menu menu) {
    Category category = menu.getCategory();
    return new MenuUpdatedResponseDto(
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
        menu.getSlug(),
        menu.emotionTagList(),
        menu.tasteTagList(),
        menu.getCreatedAt(),
        menu.getUpdatedAt()
    );
  }
}
