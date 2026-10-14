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

  @Column
  private String category; // 카테고리

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
      String category,
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

  public void update(String korName, String engName, Integer price) {
    this.korName = korName;
    this.engName = engName;
    this.price = price;
  }

  public void update(
      String korName,
      String engName,
      String imageUrl,
      Integer price,
      String category,
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

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  private void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
