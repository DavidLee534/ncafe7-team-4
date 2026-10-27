package com.newcafe.backend.dto.admin.main;

// 관리자 메인의 회원 수. 관리자 계정은 빼고 센다
public record AdminMainMemberSummaryDto(
    long all,
    long active,
    long suspended
) {
}
