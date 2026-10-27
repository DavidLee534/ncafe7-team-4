package com.newcafe.backend.dto.admin.secretrecipe;

// GET /api/v1/admin/secret-recipes/summary 응답 (목록 상단의 개수)
// all·rare·legend 는 레시피 수, discoveries 는 모든 회원의 발견 기록 수
public record SecretRecipeSummaryResponseDto(
    long all,
    long rare,
    long legend,
    long discoveries
) {
}
