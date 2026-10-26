package com.newcafe.backend.repository;

import com.newcafe.backend.entity.PotionShowcase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PotionShowcaseRepository extends JpaRepository<PotionShowcase, Long> {

  // 회원이 쓴 자랑글이 있는지. 있으면 관리자가 회원을 지울 수 없다
  boolean existsByMemberId(Long memberId);
}
