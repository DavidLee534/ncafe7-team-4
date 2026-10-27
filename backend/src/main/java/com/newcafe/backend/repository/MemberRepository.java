package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface MemberRepository extends JpaRepository<Member, Long> {

  // 역할(member, admin)별 회원 수. 도감의 "이 레시피를 찾은 회원 비율" 분모로 쓴다
  long countByRole(String role);
}
