package com.newcafe.backend.dto.admin.secretrecipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// POST /api/v1/admin/secret-recipes 요청 본문. id는 DB가 정하므로 받지 않는다
// categoryId(계열)는 서비스에서 Category로 찾아 넘긴다. visible을 비우면 true(손님 도감에 보임)
// 같은 이름이 있으면 409. 검증에 실패하면 400 (컨트롤러의 @Valid)
// 재료 조합(ingredientIds)은 재료 관리가 머지된 뒤 추가한다
public record SecretRecipeCreateRequestDto(
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

    Boolean visible
) {
  public SecretRecipe toEntity(Category category) {
    return SecretRecipe.builder()
        .name(name.trim())
        .grade(grade)
        .category(category)
        .color(color)
        .description(description)
        .riddle(riddle)
        .visible(!Boolean.FALSE.equals(visible))
        .build();
  }
}
