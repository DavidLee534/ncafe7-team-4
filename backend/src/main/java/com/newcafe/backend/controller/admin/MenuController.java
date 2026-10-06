package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;
import com.newcafe.backend.service.admin.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/menus")
@RequiredArgsConstructor
public class MenuController {

  private final MenuService menuService;

  // 메뉴 생성. 성공하면 201과 저장된 메뉴
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MenuResponseDto createMenu(@RequestBody MenuCreateRequestDto request) {
    return menuService.createMenu(request);
  }

  @GetMapping
  public List<MenuResponseDto> findAllMenus() {
    return menuService.findAllMenus();
  }

  // 메뉴 상세. 없는 id면 404
  @GetMapping("/{id}")
  public MenuResponseDto getMenu(@PathVariable Long id) {
    return menuService.getMenu(id);
  }

  // 메뉴 수정. id는 경로에서 받고, 본문의 값으로 덮어쓴다
  @PutMapping("/{id}")
  public MenuResponseDto updateMenu(@PathVariable Long id, @RequestBody MenuUpdateRequestDto request) {
    return menuService.updateMenu(id, request);
  }

  // 메뉴 삭제. 성공하면 본문 없이 204
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMenu(@PathVariable Long id) {
    menuService.deleteMenu(id);
  }
}
