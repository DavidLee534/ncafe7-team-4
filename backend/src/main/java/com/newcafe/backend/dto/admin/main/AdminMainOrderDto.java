package com.newcafe.backend.dto.admin.main;

import com.newcafe.backend.entity.Order;
import java.time.LocalDateTime;

// 관리자 메인의 "처리할 주문" 한 줄
public record AdminMainOrderDto(
    Long id,
    String orderNumber,
    String pickupName,
    String pickupType,
    Integer totalPrice,
    LocalDateTime createdAt
) {
  public static AdminMainOrderDto from(Order order) {
    return new AdminMainOrderDto(
        order.getId(),
        order.getOrderNumber(),
        order.getPickupName(),
        order.getPickupType(),
        order.getTotalPrice(),
        order.getCreatedAt()
    );
  }
}
