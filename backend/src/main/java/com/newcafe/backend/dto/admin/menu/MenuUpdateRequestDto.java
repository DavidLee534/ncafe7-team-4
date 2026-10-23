package com.newcafe.backend.dto.admin.menu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;

// PUT /api/v1/admin/menus/{id} 요청 본문. 수정할 메뉴의 id는 경로에서 받는다
// 이미지(imageUrl)와 인기(popular)는 아직 화면에서 바꾸지 않아서 받지 않고 기존 값을 유지한다
// status, ownerRecommended, slug, emotionTags, tasteTags를 비우면(null) 기존 값을 유지한다
// 태그를 모두 지우려면 빈 목록([])을 보낸다
// 검증에 실패하면 400 (컨트롤러의 @Valid)
public record MenuUpdateRequestDto(
    @NotBlank(message = "한글 이름을 입력하세요.")
    @Size(max = 50, message = "한글 이름은 50자 이하로 입력하세요.")
    String korName,

    @NotBlank(message = "영문 이름을 입력하세요.")
    @Size(max = 50, message = "영문 이름은 50자 이하로 입력하세요.")
    String engName,

    @NotNull(message = "가격을 입력하세요.")
    @PositiveOrZero(message = "가격은 0원 이상으로 입력하세요.")
    Integer price,

    @NotNull(message = "카테고리를 선택하세요.")
    Long categoryId,

    @Size(max = 1000, message = "설명은 1000자 이하로 입력하세요.")
    String description,

    @Pattern(regexp = "on|soldout|hidden", message = "상태는 on, soldout, hidden 중 하나여야 합니다.")
    String status,

    Boolean ownerRecommended,

    @Size(max = 60, message = "slug는 60자 이하로 입력하세요.")
    @Pattern(regexp = MenuTagRules.SLUG, message = "slug는 영문 소문자, 숫자, 하이픈(-)으로 입력하세요. (예: caffe-latte)")
    String slug,

    @Size(max = 3, message = "감정 태그는 3개까지 고를 수 있습니다.")
    List<@Pattern(regexp = MenuTagRules.EMOTIONS, message = "알 수 없는 감정 태그입니다.") String> emotionTags,

    @Size(max = 3, message = "맛 태그는 3개까지 고를 수 있습니다.")
    List<@Pattern(regexp = MenuTagRules.TASTES, message = "알 수 없는 맛 태그입니다.") String> tasteTags
) {
  // 태그 목록을 저장할 문자열로. 요청에 없으면(null) 기존 값(current), 빈 목록이면 null(태그 지움)
  public String emotionTagsOr(String current) {
    return emotionTags == null ? current : MenuTagRules.join(emotionTags);
  }

  public String tasteTagsOr(String current) {
    return tasteTags == null ? current : MenuTagRules.join(tasteTags);
  }
}
