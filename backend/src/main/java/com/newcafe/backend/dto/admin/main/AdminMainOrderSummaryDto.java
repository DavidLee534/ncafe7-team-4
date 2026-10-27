package com.newcafe.backend.dto.admin.main;

// 관리자 메인의 주문 현황
// ordered(현장 결제 예정) · paid(결제 완료) · brewing(제조 중) · ready(픽업 대기)
// todayCount · todayOrderAmount 는 오늘 0시부터의 주문 수와 주문 금액 (취소 제외)
public record AdminMainOrderSummaryDto(
    long ordered,
    long paid,
    long brewing,
    long ready,
    long todayCount,
    long todayOrderAmount
) {
}
