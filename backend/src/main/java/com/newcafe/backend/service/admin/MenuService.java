package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;

import java.util.List;

// 관리자 메뉴 관리 업무. 구현체는 DfMenuService
// 컨트롤러와는 DTO로만 주고받고, 엔티티는 서비스 안에서만 다룬다
public interface MenuService {

  MenuResponseDto createMenu(MenuCreateRequestDto request);

  List<MenuResponseDto> findAllMenus();

  MenuResponseDto getMenu(Long id);

  MenuResponseDto updateMenu(Long id, MenuUpdateRequestDto request);

  void deleteMenu(Long id);
}
