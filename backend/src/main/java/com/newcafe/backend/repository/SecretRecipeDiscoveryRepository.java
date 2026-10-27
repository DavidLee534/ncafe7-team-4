package com.newcafe.backend.repository;

import com.newcafe.backend.entity.SecretRecipeDiscovery;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface SecretRecipeDiscoveryRepository extends JpaRepository<SecretRecipeDiscovery, Long> {

  // 레시피별 발견 횟수를 한 번에 센다. 결과 한 줄 = [secretRecipeId, count]
  // 목록에서 레시피마다 따로 세면 N+1 이라 group by 쿼리 하나로 처리한다
  @Query("select d.secretRecipe.id, count(d) from SecretRecipeDiscovery d group by d.secretRecipe.id")
  List<Object[]> countGroupBySecretRecipe();

  // 레시피 하나의 발견 횟수
  long countBySecretRecipeId(Long secretRecipeId);

  // 이 레시피를 발견한 기록이 있는지. 있으면 삭제할 수 없다
  boolean existsBySecretRecipeId(Long secretRecipeId);

  // 이 레시피를 발견한 회원 목록 (최근 발견순). 회원은 fetch join으로 함께 가져온다
  @Query("""
      select d from SecretRecipeDiscovery d join fetch d.member
      where d.secretRecipe.id = :secretRecipeId
      order by d.discoveredAt desc, d.id desc
      """)
  List<SecretRecipeDiscovery> findAllBySecretRecipeIdWithMember(@Param("secretRecipeId") Long secretRecipeId);

  // 회원 도감: 이 회원의 발견 기록 전체 (어떤 레시피를 언제 찾았는지)
  @Query("select d from SecretRecipeDiscovery d where d.member.id = :memberId")
  List<SecretRecipeDiscovery> findAllByMemberId(@Param("memberId") Long memberId);

  // 회원 도감 상세: 이 회원이 이 레시피를 찾은 기록
  Optional<SecretRecipeDiscovery> findByMemberIdAndSecretRecipeId(Long memberId, Long secretRecipeId);

  // 이 회원이 찾은 비밀 레시피 중 손님에게 보이는(visible) 것의 수 (도감 요약)
  @Query("select count(d) from SecretRecipeDiscovery d where d.member.id = :memberId and d.secretRecipe.visible = true")
  long countVisibleByMemberId(@Param("memberId") Long memberId);
}
