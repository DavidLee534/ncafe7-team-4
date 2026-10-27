package com.newcafe.backend.repository;

import com.newcafe.backend.entity.SecretRecipeDiscovery;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SecretRecipeDiscoveryRepository extends JpaRepository<SecretRecipeDiscovery, Long> {

  // 관리자가 회원을 지울 때, 그 회원의 비밀 레시피 발견 기록도 함께 지운다
  void deleteAllByMemberId(Long memberId);

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
}
