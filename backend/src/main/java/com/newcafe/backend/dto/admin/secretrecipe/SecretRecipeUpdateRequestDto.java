package com.newcafe.backend.dto.admin.secretrecipe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

// PUT /api/v1/admin/secret-recipes/{id} 요청 본문. 수정할 레시피의 id는 경로에서 받는다
// visible을 비우면(null) 기존 값을 유지한다. 손님 도감에서 숨기려면 false
// 다른 레시피와 이름이 같으면 409. 검증에 실패하면 400 (컨트롤러의 @Valid)
public record SecretRecipeUpdateRequestDto(
    @NotBlank(message = "레시피 이름을 입력하세요.")
    @Size(max = 30, message = "레시피 이름은 30자 이하로 입력하세요.")
    String name,

    @NotBlank(message = "등급을 선택하세요.")
    @Pattern(regexp = SecretRecipeRules.GRADE, message = "등급은 rare, legend 중 하나여야 합니다.")
    String grade,

    @NotNull(message = "계열(카테고리)을 선택하세요.")
    Long categoryId,

    @NotBlank(message = "포션 색을 입력하세요.")
    @Pattern(regexp = SecretRecipeRules.COLOR, message = "포션 색은 #RRGGBB 형식으로 입력하세요. (예: #d9a03c)")
    String color,

    @Size(max = 1000, message = "설명은 1000자 이하로 입력하세요.")
    String description,

    @Size(max = 500, message = "수수께끼는 500자 이하로 입력하세요.")
    String riddle,

    Boolean visible,

    // 재료 조합. ingredientIds 는 기반 재료(baseIngredientId)를 포함한 재료 id 전체
    // 비우면(null) 기존 조합 유지, 빈 목록이면 조합을 지운다. 다른 레시피와 조합이 같으면 409
    Long baseIngredientId,
    List<Long> ingredientIds
) {
}
