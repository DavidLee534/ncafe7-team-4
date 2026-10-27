package com.newcafe.backend.dto.checkout;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartQuantityRequest(@NotNull @Min(1) @Max(20) @Digits(integer = 2, fraction = 0) BigDecimal quantity) {
}
