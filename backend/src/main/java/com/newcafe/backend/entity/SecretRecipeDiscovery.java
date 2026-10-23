package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 회원이 비밀 레시피를 처음 맞힌 기록. 한 회원은 같은 레시피를 한 번만 발견한다
// 회원 도감의 비밀 탭(/my/secret-recipes)과 관리자 "발견한 회원 목록"에서 쓴다
@Entity
@Table(
    name = "secret_recipe_discoveries",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_discovery_member_recipe",
        columnNames = {"member_id", "secret_recipe_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SecretRecipeDiscovery {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "secret_recipe_id", nullable = false)
  private SecretRecipe secretRecipe;

  @Column(name = "discovered_at", updatable = false)
  private LocalDateTime discoveredAt;  // 처음 맞힌 시각

  @Builder
  private SecretRecipeDiscovery(Member member, SecretRecipe secretRecipe) {
    this.member = member;
    this.secretRecipe = secretRecipe;
  }

  @PrePersist
  private void onCreate() {
    this.discoveredAt = LocalDateTime.now();
  }
}
