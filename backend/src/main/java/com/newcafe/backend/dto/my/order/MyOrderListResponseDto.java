package com.newcafe.backend.dto.my.order;

import java.time.LocalDateTime;

public record MyOrderListResponseDto(Long id, String orderNumber, String status,
    String itemSummary, Integer totalPrice, LocalDateTime createdAt) {}
