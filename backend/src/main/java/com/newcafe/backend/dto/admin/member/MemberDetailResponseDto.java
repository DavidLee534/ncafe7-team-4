package com.newcafe.backend.dto.admin.member;

import com.newcafe.backend.entity.Member;
import java.time.LocalDateTime;

// GET /api/v1/admin/members/{id} 응답 (회원 상세)
// orderCount, recipeCount는 서비스에서 세어 넘긴다. 비밀번호는 응답에 절대 넣지 않는다
public record MemberDetailResponseDto(
    Long id,
    String email,
    String nickname,
    String role,
    String status,
    long orderCount,
    long recipeCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
  public static MemberDetailResponseDto from(Member member, long orderCount, long recipeCount) {
    return new MemberDetailResponseDto(
        member.getId(),
        member.getEmail(),
        member.getNickname(),
        member.getRole(),
        member.getStatus(),
        orderCount,
        recipeCount,
        member.getCreatedAt(),
        member.getUpdatedAt()
    );
  }
}
