package com.newcafe.backend.dto.admin.secretrecipe;

import com.newcafe.backend.entity.SecretRecipeDiscovery;
import java.time.LocalDateTime;

// GET /api/v1/admin/secret-recipes/{id}/discoveries 응답의 한 줄 (이 레시피를 발견한 회원)
public record SecretRecipeDiscoveryListResponseDto(
    Long memberId,
    String nickname,
    LocalDateTime discoveredAt
) {
  public static SecretRecipeDiscoveryListResponseDto from(SecretRecipeDiscovery discovery) {
    return new SecretRecipeDiscoveryListResponseDto(
        discovery.getMember().getId(),
        discovery.getMember().getNickname(),
        discovery.getDiscoveredAt()
    );
  }
}
