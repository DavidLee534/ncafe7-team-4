package com.newcafe.backend.repository.checkout;

import com.newcafe.backend.entity.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutCartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByMemberIdOrderByIdAsc(Long memberId);
    Optional<CartItem> findByIdAndMemberId(Long id, Long memberId);
}
