package com.newcafe.backend.repository;

import com.newcafe.backend.entity.ShowcaseRating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowcaseRatingRepository extends JpaRepository<ShowcaseRating, Long> {

  // 관리자가 회원을 지울 때, 그 회원이 준 별점도 함께 지운다
  void deleteAllByMemberId(Long memberId);
}
