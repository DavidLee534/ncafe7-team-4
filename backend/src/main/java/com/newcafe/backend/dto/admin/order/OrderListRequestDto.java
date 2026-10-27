package com.newcafe.backend.dto.admin.order;

// GET /api/v1/admin/orders 검색 조건 (쿼리스트링 ?status=paid&keyword=NC2610&sort=oldest&size=5)
// 모두 선택값이고, 비우면 그 조건으로 거르지 않는다. 아무것도 없으면 전체 목록
// keyword는 주문번호와 픽업 이름에서 대소문자 없이 찾는다
// sort=oldest면 오래된 주문부터(제조 대기 순서), 비우면 최근 주문부터. size를 비우면 개수 제한 없음
public record OrderListRequestDto(
    String status,
    String keyword,
    String sort,
    Integer size
) {
}
