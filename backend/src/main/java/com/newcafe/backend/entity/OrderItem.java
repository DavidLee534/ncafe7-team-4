package com.newcafe.backend.entity;

import jakarta.persistence.*;
import lombok.*;

// 주문의 한 줄. 주문한 순간의 이름·재료·가격을 복사해 둔다
// 메뉴·포션을 외래키로 잇지 않는 이유: 나중에 메뉴 가격이 바뀌거나 메뉴를 지워도 지난 주문 내역은 그대로 보여야 하고,
// 주문된 적 있는 메뉴를 외래키 때문에 지우지 못하는 일도 막기 위해서다
@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @Column(name = "item_type", nullable = false)
  private String itemType; // menu(메뉴) / recipe(회원이 만든 포션)

  @Column(nullable = false)
  private String name; // 주문할 때의 이름

  @Column(length = 500)
  private String options; // 기반·추가 재료를 쉼표로 이은 값 (예: "다크 로스트,바닐라"). 메뉴면 비어 있음

  @Column(name = "unit_price", nullable = false)
  private Integer unitPrice; // 주문할 때의 한 개 가격

  @Column(nullable = false)
  private Integer quantity; // 수량

  @Builder
  private OrderItem(String itemType, String name, String options, Integer unitPrice, Integer quantity) {
    this.itemType = itemType;
    this.name = name;
    this.options = options;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }

  // Order.addItem 에서만 부른다
  void assignOrder(Order order) {
    this.order = order;
  }

  public int lineTotal() {
    return unitPrice * quantity;
  }
}
