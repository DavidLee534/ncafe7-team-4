package com.newcafe.backend.dto.my.order;

import java.time.LocalDateTime;
import java.util.List;

public record MyOrderDetailResponseDto(Long id, String orderNumber, String status,
    String itemSummary, Integer totalPrice, LocalDateTime createdAt,
    String pickupName, String pickupType, String request,
    List<Item> items, PaymentInfo payment) {
  public record Item(String name, String options, Integer unitPrice, Integer quantity, Integer lineTotal) {}
  public record PaymentInfo(String method, String detail, Integer amount, String approvalCode, LocalDateTime paidAt) {}
}
