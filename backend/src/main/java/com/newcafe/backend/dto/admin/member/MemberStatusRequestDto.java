package com.newcafe.backend.dto.admin.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// PATCH /api/v1/admin/members/{id}/status 요청 본문. 예: {"status": "suspended"}
public record MemberStatusRequestDto(
    @NotBlank(message = "바꿀 회원 상태를 보내세요.")
    @Pattern(regexp = "active|suspended", message = "회원 상태는 active, suspended 중 하나입니다.")
    String status
) {
}
