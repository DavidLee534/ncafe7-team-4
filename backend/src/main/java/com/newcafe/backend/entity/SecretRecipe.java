package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 비밀 레시피. 관리자가 정해 둔 재료 조합으로, 손님이 연금 공방에서 맞히면 도감에 열린다
// 재료 조합(SecretRecipeIngredient)은 재료 관리(Ingredient)가 develop에 머지된 뒤 추가한다
@Entity
@Table(name = "secret_recipes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SecretRecipe {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @Column(nullable = false, unique = true)
  private String name; // 레시피 이름 (예: 대연금술사의 황금 꼬리)

  @Column(nullable = false)
  private String grade; // rare(희귀) / legend(전설)

  // 계열. 메뉴와 같은 카테고리를 쓴다 (커피, 티 ...)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

  @Column(nullable = false)
  private String color; // 포션 색 (#RRGGBB)

  @Column(length = 1000)
  private String description; // 발견한 뒤 보이는 설명

  @Column(length = 500)
  private String riddle; // 발견하기 전에 보이는 모카 점장의 수수께끼

  @Column(nullable = false)
  private boolean visible; // false 면 손님 도감에서 숨김

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 등록일

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;  // 수정일

  @Builder
  private SecretRecipe(
      String name,
      String grade,
      Category category,
      String color,
      String description,
      String riddle,
      boolean visible) {
    this.name = name;
    this.grade = grade;
    this.category = category;
    this.color = color;
    this.description = description;
    this.riddle = riddle;
    this.visible = visible;
  }

  // 비밀 레시피 수정 화면의 값으로 덮어쓴다
  public void update(
      String name,
      String grade,
      Category category,
      String color,
      String description,
      String riddle,
      boolean visible) {
    this.name = name;
    this.grade = grade;
    this.category = category;
    this.color = color;
    this.description = description;
    this.riddle = riddle;
    this.visible = visible;
    this.updatedAt = LocalDateTime.now();
  }

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
