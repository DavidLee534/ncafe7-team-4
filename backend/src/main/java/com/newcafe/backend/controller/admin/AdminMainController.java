package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.main.AdminMainResponseDto;
import com.newcafe.backend.service.admin.AdminMainService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminMainController {

  private final AdminMainService adminMainService;

  // 관리자 메인 화면 데이터. 메뉴 · 재료 · 주문 · 회원 현황과 최근 항목을 한 번에
  @GetMapping
  public AdminMainResponseDto getMain() {
    return adminMainService.getMain();
  }
}
