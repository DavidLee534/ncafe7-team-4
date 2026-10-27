package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "showcase_comments", indexes = {
    @Index(name = "idx_showcase_comment_post", columnList = "showcase_id, created_at"),
    @Index(name = "idx_showcase_comment_parent", columnList = "parent_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShowcaseComment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "showcase_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private PotionShowcase showcase;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private ShowcaseComment parent;

  @Column(nullable = false, length = 1000)
  private String content;

  @Column(nullable = false)
  private boolean deleted;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Builder
  private ShowcaseComment(PotionShowcase showcase, Member member, ShowcaseComment parent, String content) {
    this.showcase = showcase;
    this.member = member;
    this.parent = parent;
    this.content = content;
  }

  public void delete() { this.deleted = true; }

  @PrePersist
  private void onCreate() { this.createdAt = LocalDateTime.now(); }
}
