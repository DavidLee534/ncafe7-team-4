package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 포션 자랑 게시글의 별점. 한 회원은 한 글에 별점 하나만 준다 (다시 주면 점수만 바꾼다)
@Entity
@Table(
    name = "showcase_ratings",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_rating_showcase_member",
        columnNames = {"showcase_id", "member_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShowcaseRating {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "showcase_id", nullable = false)
  private PotionShowcase showcase;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @Column(nullable = false)
  private Integer score; // 1 ~ 5

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 처음 준 시각

  @Builder
  private ShowcaseRating(PotionShowcase showcase, Member member, Integer score) {
    this.showcase = showcase;
    this.member = member;
    this.score = score;
  }

  // 이미 별점을 준 글에 다시 주면 점수만 바꾼다
  public void changeScore(Integer score) {
    this.score = score;
  }

  @PrePersist
  private void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
}
