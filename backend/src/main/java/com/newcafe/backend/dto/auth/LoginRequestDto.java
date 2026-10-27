package com.newcafe.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

// POST /api/v1/auth/login 요청 본문
public record LoginRequestDto(
    @NotBlank(message = "이메일을 입력하세요.")
    String email,

    @NotBlank(message = "비밀번호를 입력하세요.")
    String password
) {
}
