package com.newcafe.backend.dto.admin.order;

// GET /api/v1/admin/orders/summary 응답 (주문 목록 상단의 상태별 개수, 오늘 매출)
// 검색 조건과 상관없이 전체 주문을 센다. todaySales는 오늘 들어온 주문 중 취소되지 않은 주문의 합계
public record OrderSummaryResponseDto(
    long all,
    long paid,
    long brewing,
    long ready,
    long done,
    long cancelled,
    long todaySales
) {
}
