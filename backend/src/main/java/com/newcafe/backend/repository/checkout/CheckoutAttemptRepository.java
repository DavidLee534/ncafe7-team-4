package com.newcafe.backend.repository.checkout;

import com.newcafe.backend.entity.CheckoutAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutAttemptRepository extends JpaRepository<CheckoutAttempt, String> {
}
