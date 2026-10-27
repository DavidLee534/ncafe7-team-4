package com.newcafe.backend.dto.checkout;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

public record CartEntryRequest(
    @Positive Long menuId,
    @Positive Long recipeId,
    @Min(1) @Max(20) @Digits(integer = 2, fraction = 0) BigDecimal quantity
) {
    public CartEntryRequest(Long menuId, Long recipeId, int quantity) {
        this(menuId, recipeId, BigDecimal.valueOf(quantity));
    }

    @AssertTrue(message = "메뉴 또는 저장한 레시피 중 하나만 선택하세요.")
    public boolean isSingleProduct() {
        return (menuId == null) != (recipeId == null);
    }

    public int requestedQuantity() {
        return quantity == null ? 1 : quantity.intValueExact();
    }
}
