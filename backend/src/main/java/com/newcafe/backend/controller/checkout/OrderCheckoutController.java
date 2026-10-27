package com.newcafe.backend.controller.checkout;

import com.newcafe.backend.dto.checkout.CheckoutReceiptResponse;
import com.newcafe.backend.dto.checkout.CheckoutRequest;
import com.newcafe.backend.service.checkout.CheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderCheckoutController {
    private final CheckoutService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckoutReceiptResponse create(
        @RequestHeader(value = "Idempotency-Key", required = false) String key,
        @Valid @RequestBody CheckoutRequest request
    ) { return service.checkout(key, request); }

    // 결제 영수증 전용. 마이페이지의 /api/v1/my/orders/{id}와 분리한다.
    @GetMapping("/{id}/receipt")
    public CheckoutReceiptResponse receipt(@PathVariable Long id) { return service.receipt(id); }
}
