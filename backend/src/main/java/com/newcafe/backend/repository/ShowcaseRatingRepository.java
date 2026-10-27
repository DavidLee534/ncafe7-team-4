package com.newcafe.backend.repository;

import com.newcafe.backend.entity.ShowcaseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ShowcaseRatingRepository extends JpaRepository<ShowcaseRating, Long> {
  interface RatingSummary {
    Long getShowcaseId();
    Double getAverageScore();
    Long getRatingCount();
  }

  @Query("select r.showcase.id as showcaseId, avg(r.score) as averageScore, count(r.id) as ratingCount " +
      "from ShowcaseRating r where r.showcase.id in :ids group by r.showcase.id")
  List<RatingSummary> summarize(@Param("ids") Collection<Long> ids);

  Optional<ShowcaseRating> findByShowcaseIdAndMemberId(Long showcaseId, Long memberId);
  void deleteByShowcaseId(Long showcaseId);

  // 관리자가 회원을 지울 때, 그 회원이 준 별점도 함께 지운다
  void deleteAllByMemberId(Long memberId);
}
