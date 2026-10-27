package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface MemberRepository extends JpaRepository<Member, Long> {

  // 인증: 로그인할 때 이메일로 회원 찾기
  Optional<Member> findByEmail(String email);

  // 인증: 회원가입할 때 이메일 중복 확인
  boolean existsByEmail(String email);
}
