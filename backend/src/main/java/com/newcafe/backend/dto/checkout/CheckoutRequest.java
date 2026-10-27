package com.newcafe.backend.dto.checkout;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CheckoutRequest(
    @NotBlank @Size(max = 50) String pickupName,
    @NotBlank @Pattern(regexp = "dine-in|takeout") String pickupType,
    @Size(max = 500) String request,
    @NotBlank @Pattern(regexp = "card|easy|transfer") String payMethod,
    @Size(max = 200) String payDetail,
    @NotBlank @Pattern(regexp = "[a-f0-9]{64}") String cartVersion
) {
}
