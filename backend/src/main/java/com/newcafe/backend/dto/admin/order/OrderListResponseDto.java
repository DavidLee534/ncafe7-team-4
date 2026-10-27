package com.newcafe.backend.dto.admin.order;

import com.newcafe.backend.entity.Order;
import java.time.LocalDateTime;

// GET /api/v1/admin/orders 응답의 한 줄 (주문 목록)
// itemCount는 주문한 잔 수(수량 합계). 서비스에서 주문별로 한 번에 세어 넘긴다
public record OrderListResponseDto(
    Long id,
    String orderNumber,
    String status,
    String pickupName,
    String pickupType,
    long itemCount,
    Integer totalPrice,
    LocalDateTime createdAt
) {
  public static OrderListResponseDto from(Order order, long itemCount) {
    return new OrderListResponseDto(
        order.getId(),
        order.getOrderNumber(),
        order.getStatus(),
        order.getPickupName(),
        order.getPickupType(),
        itemCount,
        order.getTotalPrice(),
        order.getCreatedAt()
    );
  }
}
