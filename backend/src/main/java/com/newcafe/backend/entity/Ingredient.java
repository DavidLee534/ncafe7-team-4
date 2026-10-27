package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import lombok.*;

// 연금 공방의 재료. 손님은 기반 재료 1개와 추가 재료를 골라 포션을 만든다 (README "공통 재료 선반")
// 기반 재료(base)는 계열(커피, 티 ...), 추가 재료(extra)는 선반(시럽, 우유 ...)에 놓인다
@Entity
@Table(name = "ingredients")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ingredient {

  public enum Kind { BASE, EXTRA }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @Column(nullable = false, unique = true)
  private String name; // 재료 이름 (예: 바닐라)

  @Column(nullable = false)
  private String type; // base(기반 재료) / extra(추가 재료)

  public Kind getKind() { return Kind.valueOf(type.toUpperCase(Locale.ROOT)); }

  @Column(nullable = false)
  private String shelf; // 기반 재료는 계열(예: 커피), 추가 재료는 선반(예: 시럽)

  @Column(nullable = false)
  private Integer price; // 추가 금액. 기반 재료는 보통 0 (메뉴 가격에 포함)

  @Column(nullable = false)
  private String color; // 포션 색 (#RRGGBB). 연금솥 액체 색을 섞는 데 쓴다

  @Column(name = "effect_tags", nullable = false)
  private String effectTags; // 효과 태그를 쉼표로 이은 값 (예: "활력,상큼함")

  @Column
  private String modifier; // 이름 앞에 붙는 수식어 (예: 빛을 머금은). 추가 재료에만 쓴다

  @Column(name = "modifier_priority")
  private Integer modifierPriority; // 수식어 우선순위. 클수록 이름 앞에 온다 (10, 20, 30)

  @Column(nullable = false)
  private boolean visible; // false 면 손님 화면의 재료 선반에서 숨김 (재고 없음 등)

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 등록일

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;  // 수정일

  @Builder
  private Ingredient(
      String name,
      String type,
      String shelf,
      Integer price,
      String color,
      String effectTags,
      String modifier,
      Integer modifierPriority,
      boolean visible) {
    this.name = name;
    this.type = type;
    this.shelf = shelf;
    this.price = price;
    this.color = color;
    this.effectTags = effectTags;
    this.modifier = modifier;
    this.modifierPriority = modifierPriority;
    this.visible = visible;
  }

  // 재료 수정 화면의 값으로 덮어쓴다
  public void update(
      String name,
      String type,
      String shelf,
      Integer price,
      String color,
      String effectTags,
      String modifier,
      Integer modifierPriority,
      boolean visible) {
    this.name = name;
    this.type = type;
    this.shelf = shelf;
    this.price = price;
    this.color = color;
    this.effectTags = effectTags;
    this.modifier = modifier;
    this.modifierPriority = modifierPriority;
    this.visible = visible;
    // 수정일은 여기서 바로 기록한다. @PreUpdate 는 트랜잭션이 끝날 때 실행돼서
    // 그 전에 만드는 수정 응답(IngredientUpdatedResponseDto)에 새 시각이 들어가지 못한다
    this.updatedAt = LocalDateTime.now();
  }

  // 쉼표로 이어 저장한 효과 태그를 목록으로 (응답 DTO용)
  public List<String> effectTagList() {
    return Arrays.stream(effectTags.split(",")).map(String::trim).filter(tag -> !tag.isEmpty()).toList();
  }

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
