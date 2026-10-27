package com.newcafe.backend.dto.admin.menu;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;

// POST /api/v1/admin/menus 요청 본문. id는 DB가 정하므로 받지 않는다
// categoryId는 서비스에서 Category로 찾아 넘긴다
// status를 비우면 "on"(판매중), ownerRecommended를 비우면 false
// slug(사용자 메뉴 상세 주소 /menus/{slug})는 관리자가 입력하지 않고 서비스가 영문 이름으로 만든다
// emotionTags · tasteTags는 감정 연금술 추천에 쓴다. 각각 3개까지
// 검증에 실패하면 400 (컨트롤러의 @Valid)
public record MenuCreateRequestDto(
    @NotBlank(message = "한글 이름을 입력하세요.") @Size(max = 50, message = "한글 이름은 50자 이하로 입력하세요.") String korName,

    @NotBlank(message = "영문 이름을 입력하세요.") @Size(max = 50, message = "영문 이름은 50자 이하로 입력하세요.") String engName,

    @NotNull(message = "가격을 입력하세요.") @PositiveOrZero(message = "가격은 0원 이상으로 입력하세요.") Integer price,

    @NotNull(message = "카테고리를 선택하세요.") Long categoryId,

    @Size(max = 1000, message = "설명은 1000자 이하로 입력하세요.") String description,

    @Pattern(regexp = "on|soldout|hidden", message = "상태는 on, soldout, hidden 중 하나여야 합니다.") String status,

    Boolean ownerRecommended,

    @Size(max = 3, message = "감정 태그는 3개까지 고를 수 있습니다.")
    List<@Pattern(regexp = MenuTagRules.EMOTIONS, message = "알 수 없는 감정 태그입니다.") String> emotionTags,

    @Size(max = 3, message = "맛 태그는 3개까지 고를 수 있습니다.")
    List<@Pattern(regexp = MenuTagRules.TASTES, message = "알 수 없는 맛 태그입니다.") String> tasteTags
) {
  public Menu toEntity(Category category, String slug) {
    return Menu.builder()
        .korName(korName)
        .engName(engName)
        .price(price)
        .category(category)
        .description(description)
        .status(status != null ? status : "on")
        .ownerRecommended(Boolean.TRUE.equals(ownerRecommended))
        .slug(slug)
        .emotionTags(MenuTagRules.join(emotionTags))
        .tasteTags(MenuTagRules.join(tasteTags))
        .build();
  }
}
