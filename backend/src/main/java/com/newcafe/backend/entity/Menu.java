package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "menus")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Menu {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @Column(name = "kor_name", nullable = false)
  private String korName; // 한글 이름

  @Column(name = "eng_name", nullable = false)
  private String engName; // 영어 이름

  @Column(name = "image_url")
  private String imageUrl;  // 이미지

  @Column(nullable = false)
  private Integer price; // 가격

  // 메뉴가 속한 카테고리. menus.category_id → categories.id 외래키
  // 기존 메뉴에는 카테고리가 없어서 비워 둘 수 있게 시작한다
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

  @Column
  private String status;  // 상태

  @Column(name = "owner_recommended")
  private boolean ownerRecommended; // 사장추천

  @Column
  private boolean popular;  // 인기메뉴

  @Column(length = 1000)
  private String description; // 설명

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 등록일

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;  // 수정일

  @Builder
  private Menu(
      String korName,
      String engName,
      String imageUrl,
      Integer price,
      Category category,
      String status,
      boolean ownerRecommended,
      boolean popular,
      String description) {
    this.korName = korName;
    this.engName = engName;
    this.imageUrl = imageUrl;
    this.price = price;
    this.category = category;
    this.status = status;
    this.ownerRecommended = ownerRecommended;
    this.popular = popular;
    this.description = description;
  }

  // 메뉴 수정 화면에서 바꾸는 값만 받는다. 이미지 · 인기 메뉴는 여기서 바꾸지 않는다
  // (이미지는 업로드 기능을 만들 때 changeImage 처럼 따로 둔다)
  public void update(
      String korName,
      String engName,
      Integer price,
      Category category,
      String status,
      boolean ownerRecommended,
      String description) {
    this.korName = korName;
    this.engName = engName;
    this.price = price;
    this.category = category;
    this.status = status;
    this.ownerRecommended = ownerRecommended;
    this.description = description;
    // 수정일은 여기서 바로 기록한다. @PreUpdate 는 트랜잭션이 끝날 때 실행돼서
    // 그 전에 만드는 수정 응답(MenuUpdatedResponseDto)에 새 시각이 들어가지 못한다
    this.updatedAt = LocalDateTime.now();
  }

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
