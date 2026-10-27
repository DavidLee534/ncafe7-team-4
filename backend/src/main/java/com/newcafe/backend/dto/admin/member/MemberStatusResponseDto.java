package com.newcafe.backend.dto.admin.member;

import com.newcafe.backend.entity.Member;
import java.time.LocalDateTime;

// PATCH /api/v1/admin/members/{id}/status 응답 (바뀐 상태)
public record MemberStatusResponseDto(
    Long id,
    String status,
    LocalDateTime updatedAt
) {
  public static MemberStatusResponseDto from(Member member) {
    return new MemberStatusResponseDto(member.getId(), member.getStatus(), member.getUpdatedAt());
  }
}
