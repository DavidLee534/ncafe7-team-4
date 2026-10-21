package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.menu.MenuCategoryListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuCreatedResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuListRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuSummaryResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdatedResponseDto;

import java.util.List;

// 관리자 메뉴 관리 업무. 구현체는 DfMenuService
// 컨트롤러와는 DTO로만 주고받고, 엔티티는 서비스 안에서만 다룬다
// 메서드 이름은 메뉴만 다루는 캡슐이므로 Menu를 다시 붙이지 않는다 (getList, getDetail ...)
public interface MenuService {

  MenuCreatedResponseDto create(MenuCreateRequestDto request);

  List<MenuListResponseDto> getList(MenuListRequestDto request);

  MenuDetailResponseDto getDetail(Long id);

  List<MenuCategoryListResponseDto> getCategories();

  MenuSummaryResponseDto getSummary(Long categoryId);

  MenuUpdatedResponseDto update(Long id, MenuUpdateRequestDto request);

  void delete(Long id);
}
