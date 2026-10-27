package com.newcafe.backend.dto.admin.ingredient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;

// PUT /api/v1/admin/ingredients/{id} 요청 본문. 수정할 재료의 id는 경로에서 받는다
// visible을 비우면 기존 값을 그대로 둔다
// 검증에 실패하면 400 (컨트롤러의 @Valid)
public record IngredientUpdateRequestDto(
    @NotBlank(message = "재료 이름을 입력하세요.")
    @Size(max = 30, message = "재료 이름은 30자 이하로 입력하세요.")
    String name,

    @NotBlank(message = "재료 종류를 선택하세요.")
    @Pattern(regexp = "base|extra", message = "재료 종류는 base, extra 중 하나여야 합니다.")
    String type,

    @NotBlank(message = "계열 또는 선반을 선택하세요.")
    @Size(max = 20, message = "계열·선반 이름은 20자 이하로 입력하세요.")
    String shelf,

    @NotNull(message = "추가 금액을 입력하세요.")
    @PositiveOrZero(message = "추가 금액은 0원 이상으로 입력하세요.")
    Integer price,

    @NotBlank(message = "포션 색을 입력하세요.")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "포션 색은 #RRGGBB 형식으로 입력하세요.")
    String color,

    @NotEmpty(message = "효과 태그를 하나 이상 고르세요.")
    @Size(max = 3, message = "효과 태그는 3개까지 고를 수 있습니다.")
    List<@Pattern(regexp = "활력|진정|달콤함|상큼함|고소함|든든함|시원함", message = "알 수 없는 효과 태그입니다.") String> effectTags,

    @Size(max = 30, message = "수식어는 30자 이하로 입력하세요.")
    String modifier,

    @PositiveOrZero(message = "수식어 우선순위는 0 이상으로 입력하세요.")
    Integer modifierPriority,

    Boolean visible
) {
}
