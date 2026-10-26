package com.newcafe.backend.dto.admin.member;

// GET /api/v1/admin/members 검색 조건 (쿼리스트링 ?keyword=moka&status=active&role=member)
// 모두 선택값이고, 비우면 그 조건으로 거르지 않는다. 아무것도 없으면 전체 목록(가입순)
// keyword는 이메일과 닉네임에서 대소문자 없이 찾는다
public record MemberListRequestDto(
    String keyword,
    String status,
    String role
) {
}
