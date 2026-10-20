package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuCreatedResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdatedResponseDto;
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
  public MenuCreatedResponseDto create(@RequestBody MenuCreateRequestDto request) {
    return menuService.create(request);
  }

  // 메뉴 목록
  @GetMapping
  public List<MenuListResponseDto> getList() {
    return menuService.getList();
  }

  // 메뉴 상세. 없는 id면 404
  @GetMapping("/{id}")
  public MenuDetailResponseDto getDetail(@PathVariable Long id) {
    return menuService.getDetail(id);
  }

  // 메뉴 수정. id는 경로에서 받고, 본문의 값으로 덮어쓴다
  @PutMapping("/{id}")
  public MenuUpdatedResponseDto update(@PathVariable Long id, @RequestBody MenuUpdateRequestDto request) {
    return menuService.update(id, request);
  }

  // 메뉴 삭제. 성공하면 본문 없이 204
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    menuService.delete(id);
  }
}
