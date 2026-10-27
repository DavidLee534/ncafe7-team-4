package com.newcafe.backend.dto.recipe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

// POST /api/v1/recipes 요청 본문 (연금솥에서 포션 만들기)
// baseMenuId 는 기반 메뉴, extras 는 그 계열 선반의 추가 재료 이름 (0~3개, 비우면 기반 메뉴만)
// 재료 관리가 머지되면 extras 대신 ingredientIds 를 받는다
// 검증에 실패하면 400 (컨트롤러의 @Valid)
public record RecipeCreateRequestDto(
    @NotNull(message = "기반 메뉴를 고르세요.")
    Long baseMenuId,

    @Size(max = 3, message = "추가 재료는 3개까지 고를 수 있습니다.")
    List<@NotBlank(message = "추가 재료 이름이 비어 있습니다.") String> extras
) {
  // 비운 extras 는 빈 목록으로
  public List<String> extrasOrEmpty() {
    return extras == null ? List.of() : extras;
  }
}
