package com.newcafe.backend.repository;

import com.newcafe.backend.entity.PotionShowcase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PotionShowcaseRepository extends JpaRepository<PotionShowcase, Long> {
  @Query("select s from PotionShowcase s join fetch s.member join fetch s.recipe order by s.createdAt desc")
  List<PotionShowcase> findAllWithDetails();

  @Query("select s from PotionShowcase s join fetch s.member join fetch s.recipe where s.member.id = :memberId order by s.createdAt desc")
  List<PotionShowcase> findByMemberWithDetails(@Param("memberId") Long memberId);

  // 회원이 쓴 자랑글이 있는지. 있으면 관리자가 회원을 지울 수 없다
  boolean existsByMemberId(Long memberId);

  // 자랑글에 올라온 포션인지. 올라온 포션은 다른 회원도 장바구니에 담을 수 있다
  boolean existsByRecipeId(Long recipeId);
}
