package com.newcafe.backend.dto.my.order;

public record MyOrderSummaryResponseDto(long all, long inProgress, long done, long cancelled) {}
