package com.newcafe.backend.service.checkout;

import com.newcafe.backend.dto.checkout.CheckoutReceiptResponse;
import com.newcafe.backend.dto.checkout.CheckoutRequest;

public interface CheckoutService {
    CheckoutReceiptResponse checkout(String key, CheckoutRequest request);
    CheckoutReceiptResponse receipt(Long id);
}
