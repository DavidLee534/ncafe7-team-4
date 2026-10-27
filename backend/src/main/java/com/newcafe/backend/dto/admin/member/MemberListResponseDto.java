package com.newcafe.backend.dto.admin.member;

import com.newcafe.backend.entity.Member;
import java.time.LocalDateTime;

// GET /api/v1/admin/members 응답의 한 줄 (회원 목록)
// 비밀번호는 응답에 절대 넣지 않는다
public record MemberListResponseDto(
    Long id,
    String email,
    String nickname,
    String role,
    String status,
    LocalDateTime createdAt
) {
  public static MemberListResponseDto from(Member member) {
    return new MemberListResponseDto(
        member.getId(),
        member.getEmail(),
        member.getNickname(),
        member.getRole(),
        member.getStatus(),
        member.getCreatedAt()
    );
  }
}
