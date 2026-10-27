package com.newcafe.backend.dto.recipe;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

// POST /api/v1/recipes 요청 본문 (연금솥에서 포션 만들기)
// baseMenuId 는 기반 메뉴(기반 재료는 서버가 메뉴로 정한다), extraIds 는 그 계열 선반에서 고른 추가 재료 id (비우면 기반 메뉴만)
// 선반별 개수 · 제외 재료 같은 조합 규칙은 서비스가 검사한다 (어기면 400)
// 검증에 실패하면 400 (컨트롤러의 @Valid)
public record RecipeCreateRequestDto(
    @NotNull(message = "기반 메뉴를 고르세요.")
    Long baseMenuId,

    @Size(max = 10, message = "추가 재료가 너무 많습니다.")
    List<@NotNull(message = "추가 재료 id가 비어 있습니다.") Long> extraIds
) {
  // 비운 extraIds 는 빈 목록으로
  public List<Long> extraIdsOrEmpty() {
    return extraIds == null ? List.of() : extraIds;
  }
}
