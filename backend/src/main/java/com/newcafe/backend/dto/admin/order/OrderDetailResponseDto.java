package com.newcafe.backend.dto.admin.order;

import com.newcafe.backend.entity.Order;
import com.newcafe.backend.entity.OrderItem;
import com.newcafe.backend.entity.Payment;
import java.time.LocalDateTime;
import java.util.List;

// GET /api/v1/admin/orders/{id} 응답 (주문 상세)
// items는 주문할 때 복사해 둔 이름·가격이라 메뉴가 바뀌거나 지워져도 그대로 보인다
// 결제 기록이 없는 주문이면 payment가 null
public record OrderDetailResponseDto(
    Long id,
    String orderNumber,
    String status,
    String memberNickname,
    String pickupName,
    String pickupType,
    String request,
    Integer totalPrice,
    List<Item> items,
    PaymentInfo payment,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
  // 주문의 한 줄
  public record Item(
      String itemType,
      String name,
      String options,
      Integer unitPrice,
      Integer quantity
  ) {
    static Item from(OrderItem item) {
      return new Item(item.getItemType(), item.getName(), item.getOptions(), item.getUnitPrice(), item.getQuantity());
    }
  }

  // 결제 정보
  public record PaymentInfo(
      String method,
      String detail,
      Integer amount,
      String approvalCode,
      LocalDateTime paidAt
  ) {
    static PaymentInfo from(Payment payment) {
      return new PaymentInfo(payment.getMethod(), payment.getDetail(), payment.getAmount(), payment.getApprovalCode(), payment.getPaidAt());
    }
  }

  public static OrderDetailResponseDto from(Order order, Payment payment) {
    return new OrderDetailResponseDto(
        order.getId(),
        order.getOrderNumber(),
        order.getStatus(),
        order.getMember().getNickname(),
        order.getPickupName(),
        order.getPickupType(),
        order.getRequest(),
        order.getTotalPrice(),
        order.getItems().stream().map(Item::from).toList(),
        payment != null ? PaymentInfo.from(payment) : null,
        order.getCreatedAt(),
        order.getUpdatedAt()
    );
  }
}
