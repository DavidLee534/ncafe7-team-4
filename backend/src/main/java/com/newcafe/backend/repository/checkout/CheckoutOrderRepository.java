package com.newcafe.backend.repository.checkout;

import com.newcafe.backend.entity.Order;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutOrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdAndMemberId(Long id, Long memberId);
}
