package com.newcafe.backend.dto.menu;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import java.util.List;

public record CustomerMenuResponseDto(
    Long id,
    String korName,
    String engName,
    Integer price,
    Long categoryId,
    String categoryName,
    Integer categorySortOrder,
    String description,
    String imageUrl,
    String status,
    boolean ownerRecommended,
    List<String> emotionTags,
    List<String> tasteTags
) {
  public static CustomerMenuResponseDto from(Menu menu) {
    Category category = menu.getCategory();
    return new CustomerMenuResponseDto(
        menu.getId(), menu.getKorName(), menu.getEngName(), menu.getPrice(),
        category == null ? null : category.getId(),
        category == null ? null : category.getName(),
        category == null ? null : category.getSortOrder(),
        menu.getDescription(), menu.getImageUrl(),
        menu.getStatus() == null ? "on" : menu.getStatus(),
        menu.isOwnerRecommended(), menu.emotionTagList(), menu.tasteTagList());
  }
}
