package com.newcafe.backend.controller;

import com.newcafe.backend.dto.menu.MenuCategoryListResponseDto;
import com.newcafe.backend.dto.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.menu.MenuListRequestDto;
import com.newcafe.backend.dto.menu.MenuListResponseDto;
import com.newcafe.backend.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 손님 메뉴 조회 (로그인 없이 본다). 관리자 MenuController 와 클래스 이름이 같아서 빈 이름을 따로 붙인다
@RestController("publicMenuController")
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class MenuController {

  private final MenuService menuService;

  // 메뉴 목록 (?categoryId=&keyword=). 숨김 메뉴는 빼고, 품절 메뉴는 status로 알려 준다
  @GetMapping
  public List<MenuListResponseDto> getList(@ModelAttribute MenuListRequestDto request) {
    return menuService.getList(request);
  }

  // 메뉴판의 카테고리 탭 (곁다리 데이터)
  @GetMapping("/categories")
  public List<MenuCategoryListResponseDto> getCategories() {
    return menuService.getCategories();
  }

  // 사장 추천 메뉴
  @GetMapping("/recommendations")
  public List<MenuListResponseDto> getRecommendations() {
    return menuService.getRecommendations();
  }

  // 메뉴 상세. 없거나 숨긴 메뉴면 404
  @GetMapping("/{slug}")
  public MenuDetailResponseDto getDetail(@PathVariable String slug) {
    return menuService.getDetail(slug);
  }
}
