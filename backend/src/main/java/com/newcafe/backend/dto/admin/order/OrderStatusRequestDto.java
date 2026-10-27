package com.newcafe.backend.dto.admin.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// PATCH /api/v1/admin/orders/{id}/status 요청 본문. 예: {"status": "brewing"}
// 바꿀 수 있는 값만 받는다(400). 지금 상태에서 그 값으로 넘어갈 수 있는지는 Order.changeStatus가 확인한다(409)
public record OrderStatusRequestDto(
    @NotBlank(message = "바꿀 주문 상태를 보내세요.")
    @Pattern(regexp = "brewing|ready|done|cancelled", message = "주문 상태는 brewing, ready, done, cancelled 중 하나입니다.")
    String status
) {
}
