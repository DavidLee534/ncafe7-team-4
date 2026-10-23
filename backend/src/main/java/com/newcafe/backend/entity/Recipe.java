package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 회원이 연금 공방에서 만든 포션(레시피). 도감(/my/recipes)과 포션 자랑 게시판에서 쓴다
// 기반 메뉴(baseMenu)를 고르고 추가 재료를 더해 만든다. 가격은 만들 때 계산해 둔다
// 재료 조합(RecipeIngredient)은 재료 관리(Ingredient)가 develop에 머지된 뒤 추가한다
@Entity
@Table(name = "recipes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Recipe {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member; // 만든 회원

  // 기반이 되는 메뉴 (예: 다크 로스트 커피). "기본 메뉴 고르기"로 만들면 추가 재료 없이 이 메뉴만
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "base_menu_id", nullable = false)
  private Menu baseMenu;

  // 재료 조합이 비밀 레시피와 같으면 그 레시피. 아니면 null
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "secret_recipe_id")
  private SecretRecipe secretRecipe;

  @Column(nullable = false)
  private String name; // 포션 이름 (예: 빛을 머금은 칠흑 고양이의 물약)

  @Column(nullable = false)
  private String grade; // normal(일반) / rare(희귀) / legend(전설)

  @Column(nullable = false)
  private Integer price; // 기반 메뉴 가격 + 추가 재료 금액

  @Column(nullable = false)
  private String color; // 포션 색 (#RRGGBB)

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 만든 날

  @Builder
  private Recipe(
      Member member,
      Menu baseMenu,
      SecretRecipe secretRecipe,
      String name,
      String grade,
      Integer price,
      String color) {
    this.member = member;
    this.baseMenu = baseMenu;
    this.secretRecipe = secretRecipe;
    this.name = name;
    this.grade = grade;
    this.price = price;
    this.color = color;
  }

  @PrePersist
  private void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
}
