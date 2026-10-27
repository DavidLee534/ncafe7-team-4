package com.newcafe.backend.dto.admin.main;

import com.newcafe.backend.dto.admin.menu.MenuCategoryListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuSummaryResponseDto;
import java.util.List;

// GET /api/v1/admin 응답 (관리자 메인 화면 한 장에 필요한 값 묶음)
// 메뉴 쪽은 메뉴 관리 API 와 같은 DTO 를 그대로 쓴다
public record AdminMainResponseDto(
    MenuSummaryResponseDto menus,                    // 메뉴 상태별 수
    AdminMainIngredientSummaryDto ingredients,       // 재료 현황
    AdminMainOrderSummaryDto orders,                 // 주문 현황 · 오늘 매출
    AdminMainMemberSummaryDto members,               // 회원 수
    List<MenuCategoryListResponseDto> categories,    // 카테고리별 메뉴 수 (화면 순서대로)
    List<MenuListResponseDto> attentionMenus,        // 손봐야 할 메뉴 (품절 · 숨김)
    List<MenuListResponseDto> recentMenus,           // 최근 수정 메뉴 5개
    List<AdminMainOrderDto> pendingOrders            // 처리할 주문 (결제 완료) 5개
) {
}
