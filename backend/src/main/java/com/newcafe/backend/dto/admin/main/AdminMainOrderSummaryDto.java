package com.newcafe.backend.dto.admin.main;

// 관리자 메인의 주문 현황
// paid(처리할 주문) · brewing(제조 중) · ready(픽업 대기)는 지금 상태의 주문 수
// todayCount · todaySales 는 오늘 0시부터의 주문 수와 매출 (취소 제외)
public record AdminMainOrderSummaryDto(
    long paid,
    long brewing,
    long ready,
    long todayCount,
    long todaySales
) {
}
