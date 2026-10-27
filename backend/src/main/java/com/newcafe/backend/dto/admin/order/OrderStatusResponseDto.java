package com.newcafe.backend.dto.admin.order;

import com.newcafe.backend.entity.Order;
import java.time.LocalDateTime;

// PATCH /api/v1/admin/orders/{id}/status 응답 (바뀐 상태)
public record OrderStatusResponseDto(
    Long id,
    String status,
    LocalDateTime updatedAt
) {
  public static OrderStatusResponseDto from(Order order) {
    return new OrderStatusResponseDto(order.getId(), order.getStatus(), order.getUpdatedAt());
  }
}
