package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Member;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, Long> {
  Optional<Member> findByEmailIgnoreCase(String email);
  boolean existsByEmailIgnoreCase(String email);

  // 역할(member, admin)별 수. 관리자 메인의 회원 수는 관리자를 빼고 센다
  long countByRole(String role);

  // 역할 안의 상태(active, suspended)별 수
  long countByRoleAndStatus(String role, String status);

  // 검색 조건으로 거른 회원 목록. 값이 null인 조건은 건너뛴다
  // keyword는 이메일과 닉네임에서 대소문자 없이 찾는다
  // keyword는 cast(... as String)으로 문자열임을 알려 준다 (PostgreSQL null 파라미터 문제, MenuRepository 참고)
  @Query("""
      select m from Member m
      where (:status is null or m.status = :status)
        and (:role is null or m.role = :role)
        and (cast(:keyword as String) is null
             or lower(m.email) like lower(concat('%', cast(:keyword as String), '%'))
             or lower(m.nickname) like lower(concat('%', cast(:keyword as String), '%')))
      """)
  List<Member> findAllByCondition(
      @Param("keyword") String keyword,
      @Param("status") String status,
      @Param("role") String role,
      Sort sort);

  // 상태(active, suspended)별 회원 수. 회원 목록 상단의 개수에 쓴다
  long countByStatus(String status);
}
