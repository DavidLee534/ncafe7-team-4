package com.newcafe.backend.dto.auth;

import com.newcafe.backend.entity.Member;

// 회원가입 응답. 비밀번호(해시)는 절대 내보내지 않는다
public record SignupResponseDto(Long id, String email, String nickname, String role) {

  public static SignupResponseDto from(Member member) {
    return new SignupResponseDto(member.getId(), member.getEmail(), member.getNickname(), member.getRole());
  }
}
