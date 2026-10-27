package com.newcafe.backend.repository;

import com.newcafe.backend.entity.PotionShowcase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface PotionShowcaseRepository extends JpaRepository<PotionShowcase, Long> {
  @Query("select s from PotionShowcase s join fetch s.member join fetch s.recipe order by s.createdAt desc")
  List<PotionShowcase> findAllWithDetails();

  @Query("select s from PotionShowcase s join fetch s.member join fetch s.recipe where s.member.id = :memberId order by s.createdAt desc")
  List<PotionShowcase> findByMemberWithDetails(@Param("memberId") Long memberId);
}
