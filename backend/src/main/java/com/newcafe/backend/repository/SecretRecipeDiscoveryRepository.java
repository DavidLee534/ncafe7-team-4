package com.newcafe.backend.repository;

import com.newcafe.backend.entity.SecretRecipeDiscovery;
import org.springframework.data.jpa.repository.JpaRepository;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface SecretRecipeDiscoveryRepository extends JpaRepository<SecretRecipeDiscovery, Long> {

  // 회원이 이 비밀 레시피를 이미 발견했는지. 처음일 때만 발견 기록을 남긴다
  boolean existsByMemberIdAndSecretRecipeId(Long memberId, Long secretRecipeId);
}
