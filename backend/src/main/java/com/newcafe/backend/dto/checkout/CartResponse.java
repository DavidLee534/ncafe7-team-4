package com.newcafe.backend.dto.checkout;

import java.util.List;

public record CartResponse(List<CartEntryResponse> items, long totalPrice, int totalQuantity, String version) {
}
