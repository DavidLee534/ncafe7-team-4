package com.newcafe.backend.dto.admin.member;

// GET /api/v1/admin/members/summary 응답 (회원 목록 상단의 상태별 개수)
// 검색 조건과 상관없이 전체 회원을 센다
public record MemberSummaryResponseDto(
    long all,
    long active,
    long suspended
) {
}
