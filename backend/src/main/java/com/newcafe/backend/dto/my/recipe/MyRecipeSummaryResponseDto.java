package com.newcafe.backend.dto.my.recipe;

// GET /api/v1/my/recipes/summary 응답 (회원 도감 상단 · 모카 점장 말풍선)
// recipeCount 내가 빚은 포션 수, secretFound/secretTotal 찾은/전체 비밀 레시피(손님에게 보이는 것만)
// legendFound/legendTotal 그중 전설, progressRate 비밀 레시피 진행률(0~100, 내림)
public record MyRecipeSummaryResponseDto(
    long recipeCount,
    long secretFound,
    long secretTotal,
    long legendFound,
    long legendTotal,
    int progressRate
) {
}
