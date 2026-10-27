package com.newcafe.backend.dto.admin.order;

// GET /api/v1/admin/orders/summary 응답 (주문 목록 상단의 상태별 개수, 오늘 매출)
// 검색 조건과 상관없이 전체 주문을 센다. todayOrderAmount는 미결제 주문도 포함한 접수 금액이다.
public record OrderSummaryResponseDto(
    long all,
    long ordered,
    long paid,
    long brewing,
    long ready,
    long done,
    long cancelled,
    long todayOrderAmount
) {
}
