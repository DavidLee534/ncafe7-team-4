package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Recipe;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

  // 이 메뉴를 기반으로 만든 포션이 있는지. 있으면 관리자가 메뉴를 지울 수 없다
  boolean existsByBaseMenuId(Long menuId);

  // 이 비밀 레시피를 맞혀서 만든 포션이 있는지. 있으면 관리자가 비밀 레시피를 지울 수 없다
  boolean existsBySecretRecipeId(Long secretRecipeId);

  // 회원 도감: 내가 만든 포션 목록 (최근에 만든 것부터). 기반 메뉴와 비밀 레시피를 함께 가져온다 (N+1 방지)
  @Query("""
      select r from Recipe r join fetch r.baseMenu left join fetch r.secretRecipe
      where r.member.id = :memberId
      order by r.createdAt desc, r.id desc
      """)
  List<Recipe> findAllByMemberIdWithMenu(@Param("memberId") Long memberId);

  // 회원 도감 상세: 내 포션 하나. 남의 포션이면 비어 있다(→ 404)
  @Query("""
      select r from Recipe r join fetch r.baseMenu left join fetch r.secretRecipe
      where r.id = :id and r.member.id = :memberId
      """)
  Optional<Recipe> findByIdAndMemberIdWithMenu(@Param("id") Long id, @Param("memberId") Long memberId);

  // 내가 만든 포션 수 (도감 요약)
  long countByMemberId(Long memberId);
}
