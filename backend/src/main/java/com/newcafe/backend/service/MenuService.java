package com.newcafe.backend.service;

import com.newcafe.backend.dto.menu.MenuCategoryListResponseDto;
import com.newcafe.backend.dto.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.menu.MenuListRequestDto;
import com.newcafe.backend.dto.menu.MenuListResponseDto;

import java.util.List;

// 손님 메뉴 조회 업무 (로그인 없이 본다). 구현체는 DfMenuService(빈 이름 publicMenuService)
// 관리자 메뉴 관리(service/admin/MenuService)와 달리 숨김 메뉴 · 숨긴 카테고리 · slug 없는 메뉴는 보이지 않는다
public interface MenuService {

  List<MenuListResponseDto> getList(MenuListRequestDto request);

  List<MenuCategoryListResponseDto> getCategories();

  List<MenuListResponseDto> getRecommendations();

  MenuDetailResponseDto getDetail(String slug);
}
