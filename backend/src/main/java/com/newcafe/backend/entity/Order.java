package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

// 주문. 장바구니를 주문으로 만들고(POST /orders) 결제하면(POST /orders/{id}/payments) paid 가 된다
// 상태 흐름: paid(결제완료) → brewing(제조중) → ready(제조완료) → done(수령완료)
//           paid 에서만 cancelled(취소) 로 바꿀 수 있다
// order 는 SQL 예약어라 테이블 이름은 orders
@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @Column(name = "order_number", nullable = false, unique = true)
  private String orderNumber; // 화면에 보이는 주문번호 (예: NC261014-4821)

  @Column(nullable = false)
  private String status; // paid / brewing / ready / done / cancelled

  @Column(name = "pickup_name", nullable = false)
  private String pickupName; // 포션이 나오면 불러 줄 이름

  @Column(name = "pickup_type", nullable = false)
  private String pickupType; // dine-in(매장) / takeout(포장)

  @Column(length = 500)
  private String request; // 요청 사항

  @Column(name = "total_price", nullable = false)
  private Integer totalPrice; // 주문 항목 합계

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 주문일

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;  // 상태가 마지막으로 바뀐 시각

  @Builder
  private Order(
      Member member,
      String orderNumber,
      String status,
      String pickupName,
      String pickupType,
      String request) {
    this.member = member;
    this.orderNumber = orderNumber;
    this.status = status != null ? status : "paid";
    this.pickupName = pickupName;
    this.pickupType = pickupType;
    this.request = request;
    this.totalPrice = 0;
  }

  // 주문 항목을 붙이고 합계를 다시 계산한다 (주문을 만들 때 장바구니 항목마다 부른다)
  public void addItem(OrderItem item) {
    items.add(item);
    item.assignOrder(this);
    this.totalPrice += item.lineTotal();
  }

  // 관리자 "제조 상태 변경". 정해진 순서로만 한 단계씩 넘어간다
  public void changeStatus(String next) {
    boolean allowed = switch (status) {
      case "paid" -> next.equals("brewing") || next.equals("cancelled");
      case "brewing" -> next.equals("ready");
      case "ready" -> next.equals("done");
      default -> false;
    };
    if (!allowed) {
      throw new IllegalStateException("주문 상태를 " + status + "에서 " + next + "(으)로 바꿀 수 없습니다.");
    }
    this.status = next;
    this.updatedAt = LocalDateTime.now();
  }

  // 회원 "주문 취소". 제조를 시작하기 전(paid)에만 할 수 있다
  public void cancel() {
    changeStatus("cancelled");
  }

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
