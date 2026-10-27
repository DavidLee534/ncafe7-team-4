package com.newcafe.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 결제 재시도 키와 승인된 주문의 연결. 기존 Order의 상태·필드를 변경하지 않는다.
@Entity
@Table(name = "checkout_attempts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CheckoutAttempt {
    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, length = 64)
    private String requestHash;

    public CheckoutAttempt(String id, Member member, Order order, String requestHash) {
        this.id = id;
        this.member = member;
        this.order = order;
        this.requestHash = requestHash;
    }
}
