package com.newcafe.backend.dto.auth;

import com.newcafe.backend.entity.Member;

// 로그인 응답. 비밀번호(해시)는 내보내지 않는다
public record LoginResponseDto(Long id, String email, String nickname, String role) {

  public static LoginResponseDto from(Member member) {
    return new LoginResponseDto(member.getId(), member.getEmail(), member.getNickname(), member.getRole());
  }
}
