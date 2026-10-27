package com.newcafe.backend.dto.admin.main;

// 관리자 메인의 재료 현황. hidden 은 손님 화면에서 숨긴 재료 수
public record AdminMainIngredientSummaryDto(
    long all,
    long base,
    long extra,
    long hidden
) {
}
