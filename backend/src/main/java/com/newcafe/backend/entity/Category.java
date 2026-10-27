package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 메뉴를 묶는 카테고리. 사용자 화면의 카테고리 탭은 sortOrder 순서로 나온다.
@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // id

  @Column(nullable = false, unique = true)
  private String name; // 화면에 보이는 이름 (예: 커피)

  @Column(name = "eng_name", nullable = false)
  private String engName; // 영문 이름 (예: Coffee)

  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder; // 탭 순서. 작을수록 앞

  @Column(nullable = false)
  private boolean visible; // false 면 사용자 화면에서 숨김

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt; // 등록일

  @Column(name = "updated_at")
  private LocalDateTime updatedAt; // 수정일

  @Builder
  private Category(String name, String engName, Integer sortOrder, boolean visible) {
    this.name = name;
    this.engName = engName;
    this.sortOrder = sortOrder;
    this.visible = visible;
  }

  // 카테고리 수정 화면의 값으로 덮어쓴다
  public void update(String name, String engName, Integer sortOrder, boolean visible) {
    this.name = name;
    this.engName = engName;
    this.sortOrder = sortOrder;
    this.visible = visible;
    // 수정일은 여기서 바로 기록한다. @PreUpdate 는 트랜잭션이 끝날 때 실행돼서
    // 그 전에 만드는 수정 응답(CategoryUpdatedResponseDto)에 새 시각이 들어가지 못한다
    this.updatedAt = LocalDateTime.now();
  }

  // 목록의 "순서 변경"으로 순서만 바꿀 때. 순서가 그대로면 수정일도 건드리지 않는다
  public void changeSortOrder(Integer sortOrder) {
    if (sortOrder.equals(this.sortOrder)) {
      return;
    }
    this.sortOrder = sortOrder;
    this.updatedAt = LocalDateTime.now();
  }

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
