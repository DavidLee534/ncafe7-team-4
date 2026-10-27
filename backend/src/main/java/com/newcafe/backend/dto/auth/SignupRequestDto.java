package com.newcafe.backend.dto.auth;

import com.newcafe.backend.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// POST /api/v1/auth/signup 요청 본문. 검증에 실패하면 400 (컨트롤러의 @Valid)
// role, status 는 받지 않는다. 가입하면 항상 member / active
public record SignupRequestDto(
    @NotBlank(message = "이메일을 입력하세요.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    String email,

    // BCrypt 는 72바이트까지만 쓰므로 최대 길이를 막는다
    @NotBlank(message = "비밀번호를 입력하세요.")
    @Size(min = 8, max = 72, message = "비밀번호는 8자 이상 72자 이하로 입력하세요.")
    String password,

    @NotBlank(message = "닉네임을 입력하세요.")
    @Size(max = 20, message = "닉네임은 20자 이하로 입력하세요.")
    String nickname
) {
  // password 자리에는 원문이 아니라 해시를 넣는다
  public Member toEntity(String passwordHash) {
    return Member.builder()
        .email(email)
        .password(passwordHash)
        .nickname(nickname)
        .build();
  }
}
