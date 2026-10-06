package com.newcafe.backend.entity;

import jakarta.persistence.*;
import lombok.*; // 롬복을 설치 한 사람만 사용할 것

@Entity
@Table(name = "menus")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 전용. 밖에서는 빌더로 만든다
public class Menu {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "kor_name", nullable = false)
  private String korName;

  @Column(name = "eng_name", nullable = false)
  private String engName;

  @Column(name = "price", nullable = false)
  private Integer price;

  // id는 DB가 정하므로 빌더에서 받지 않는다
  @Builder
  private Menu(String korName, String engName, Integer price) {
    this.korName = korName;
    this.engName = engName;
    this.price = price;
  }

  // 값 변경은 setter 대신 이 메서드로만 한다
  public void update(String korName, String engName, Integer price) {
    this.korName = korName;
    this.engName = engName;
    this.price = price;
  }
}
