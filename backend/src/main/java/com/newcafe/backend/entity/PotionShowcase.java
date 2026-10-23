package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 포션 자랑 게시글. 회원이 도감에 있는 자기 포션(recipe)을 골라 공유한다
// 평균 별점은 컬럼으로 두지 않고 ShowcaseRating 에서 계산한다
@Entity
@Table(name = "potion_showcases")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PotionShowcase {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member; // 글쓴이

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "recipe_id", nullable = false)
  private Recipe recipe; // 자랑하는 포션

  @Column(nullable = false)
  private String title; // 제목

  @Column(length = 2000)
  private String content; // 본문

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 작성일

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;  // 수정일

  @Builder
  private PotionShowcase(Member member, Recipe recipe, String title, String content) {
    this.member = member;
    this.recipe = recipe;
    this.title = title;
    this.content = content;
  }

  // 게시글 수정. 글쓴이인지는 서비스에서 확인한다 (다르면 403)
  public void update(String title, String content) {
    this.title = title;
    this.content = content;
    this.updatedAt = LocalDateTime.now();
  }

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
