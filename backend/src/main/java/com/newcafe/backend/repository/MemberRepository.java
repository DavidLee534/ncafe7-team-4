package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface MemberRepository extends JpaRepository<Member, Long> {
  Optional<Member> findByEmailIgnoreCase(String email);
  boolean existsByEmailIgnoreCase(String email);
}
