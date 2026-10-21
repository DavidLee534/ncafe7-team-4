package com.newcafe.backend.dto.admin.menu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

// PUT /api/v1/admin/menus/{id} 요청 본문. 수정할 메뉴의 id는 경로에서 받는다
// 이미지(imageUrl)와 인기(popular)는 아직 화면에서 바꾸지 않아서 받지 않고 기존 값을 유지한다
// status, ownerRecommended를 비우면 기존 값을 유지한다
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

    Boolean ownerRecommended
) {
}
