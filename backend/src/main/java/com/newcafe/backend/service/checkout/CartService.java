package com.newcafe.backend.service.checkout;

import com.newcafe.backend.dto.checkout.CartEntryRequest;
import com.newcafe.backend.dto.checkout.CartEntryResponse;
import com.newcafe.backend.dto.checkout.CartResponse;
import java.util.List;

public interface CartService {
    CartResponse cart();
    CartEntryResponse add(CartEntryRequest request);
    CartEntryResponse changeQuantity(Long id, int quantity);
    void remove(Long id);
    void clear();
}
