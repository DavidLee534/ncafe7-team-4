package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface MemberRepository extends JpaRepository<Member, Long> {
  Optional<Member> findByEmailIgnoreCase(String email);
  boolean existsByEmailIgnoreCase(String email);

  // 역할(member, admin)별 수. 관리자 메인의 회원 수는 관리자를 빼고 센다
  long countByRole(String role);

  // 역할 안의 상태(active, suspended)별 수
  long countByRoleAndStatus(String role, String status);
}
