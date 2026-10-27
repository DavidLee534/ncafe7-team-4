package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 기존 주문의 결제 기록. 현재 현장 결제 주문은 접수 시 결제 기록을 만들지 않는다.
@Entity
@Table(name = "payments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id", nullable = false, unique = true)
  private Order order;

  @Column(nullable = false)
  private String method; // card(신용·체크카드) / easy(간편결제) / transfer(계좌이체)

  @Column
  private String detail; // 결제창에서 고른 내용 (예: 달빛카드 · 일시불)

  @Column(nullable = false)
  private Integer amount; // 결제 금액 (= 주문 합계)

  @Column(name = "approval_code", nullable = false)
  private String approvalCode; // 결제 승인번호

  @Column(name = "paid_at", updatable = false)
  private LocalDateTime paidAt;  // 결제 시각

  @Builder
  private Payment(Order order, String method, String detail, Integer amount, String approvalCode) {
    this.order = order;
    this.method = method;
    this.detail = detail;
    this.amount = amount;
    this.approvalCode = approvalCode;
  }

  @PrePersist
  private void onCreate() {
    this.paidAt = LocalDateTime.now();
  }
}
