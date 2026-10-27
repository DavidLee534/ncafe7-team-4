package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.main.AdminMainIngredientSummaryDto;
import com.newcafe.backend.dto.admin.main.AdminMainMemberSummaryDto;
import com.newcafe.backend.dto.admin.main.AdminMainOrderDto;
import com.newcafe.backend.dto.admin.main.AdminMainOrderSummaryDto;
import com.newcafe.backend.dto.admin.main.AdminMainResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuListRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuListResponseDto;
import com.newcafe.backend.repository.IngredientRepository;
import com.newcafe.backend.repository.MemberRepository;
import com.newcafe.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfAdminMainService implements AdminMainService {

  // 메뉴 쪽은 메뉴 관리 서비스의 summary · 목록 조건을 그대로 다시 쓴다
  private final MenuService menuService;
  private final IngredientRepository ingredientRepository;
  private final OrderRepository orderRepository;
  private final MemberRepository memberRepository;

  @Override
  public AdminMainResponseDto getMain() {
    return new AdminMainResponseDto(
        menuService.getSummary(null),
        getIngredientSummary(),
        getOrderSummary(),
        getMemberSummary(),
        menuService.getCategories(),
        getAttentionMenus(),
        menuService.getList(new MenuListRequestDto(null, null, null, null, "updatedAt", 5)),
        orderRepository.findTop5ByStatusOrderByCreatedAtAsc("paid").stream()
            .map(AdminMainOrderDto::from)
            .toList());
  }

  private AdminMainIngredientSummaryDto getIngredientSummary() {
    return new AdminMainIngredientSummaryDto(
        ingredientRepository.count(),
        ingredientRepository.countByType("base"),
        ingredientRepository.countByType("extra"),
        ingredientRepository.countByVisibleFalse());
  }

  // 오늘 = 서버 시각 기준 오늘 0시부터
  private AdminMainOrderSummaryDto getOrderSummary() {
    LocalDateTime today = LocalDate.now().atStartOfDay();
    return new AdminMainOrderSummaryDto(
        orderRepository.countByStatus("paid"),
        orderRepository.countByStatus("brewing"),
        orderRepository.countByStatus("ready"),
        orderRepository.countSince(today),
        orderRepository.sumTotalPriceSince(today));
  }

  private AdminMainMemberSummaryDto getMemberSummary() {
    return new AdminMainMemberSummaryDto(
        memberRepository.countByRole("member"),
        memberRepository.countByRoleAndStatus("member", "active"),
        memberRepository.countByRoleAndStatus("member", "suspended"));
  }

  // 품절 메뉴 다음에 숨긴 메뉴
  private List<MenuListResponseDto> getAttentionMenus() {
    List<MenuListResponseDto> menus = new ArrayList<>();
    menus.addAll(menuService.getList(new MenuListRequestDto(null, "soldout", null, null, null, null)));
    menus.addAll(menuService.getList(new MenuListRequestDto(null, "hidden", null, null, null, null)));
    return menus;
  }
}
