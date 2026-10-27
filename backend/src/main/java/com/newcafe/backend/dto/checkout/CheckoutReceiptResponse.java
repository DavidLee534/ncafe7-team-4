package com.newcafe.backend.dto.checkout;

import com.newcafe.backend.entity.Order;
import com.newcafe.backend.entity.Payment;
import java.time.LocalDateTime;
import java.util.List;

public record CheckoutReceiptResponse(
    Long id, String orderNumber, String status, String pickupName, String pickupType,
    String request, int totalPrice, List<Item> items, PaymentInfo payment
) {
    public record Item(String itemType, String name, String options, int unitPrice, int quantity, int lineTotal) {}
    public record PaymentInfo(String method, String detail, int amount, String approvalCode, LocalDateTime paidAt) {}

    public static CheckoutReceiptResponse from(Order order, Payment payment) {
        return new CheckoutReceiptResponse(order.getId(), order.getOrderNumber(), order.getStatus(),
            order.getPickupName(), order.getPickupType(), order.getRequest(), order.getTotalPrice(),
            order.getItems().stream().map(item -> new Item(item.getItemType(), item.getName(),
                item.getOptions(), item.getUnitPrice(), item.getQuantity(), item.lineTotal())).toList(),
            new PaymentInfo(payment.getMethod(), payment.getDetail(), payment.getAmount(),
                payment.getApprovalCode(), payment.getPaidAt()));
    }
}
