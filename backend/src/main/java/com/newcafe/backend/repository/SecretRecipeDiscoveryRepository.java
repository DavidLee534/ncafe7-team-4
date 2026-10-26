package com.newcafe.backend.repository;

import com.newcafe.backend.entity.SecretRecipeDiscovery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecretRecipeDiscoveryRepository extends JpaRepository<SecretRecipeDiscovery, Long> {

  // 관리자가 회원을 지울 때, 그 회원의 비밀 레시피 발견 기록도 함께 지운다
  void deleteAllByMemberId(Long memberId);
}
