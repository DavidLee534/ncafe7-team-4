package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Payment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

  // 주문의 결제 기록. 주문 하나에 결제 하나. 결제 전 주문이면 비어 있다
  Optional<Payment> findByOrderId(Long orderId);
}
