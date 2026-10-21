package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.menu.MenuCategoryListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuCreatedResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuListRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuSummaryResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdatedResponseDto;
import com.newcafe.backend.service.admin.MenuService;
import jakarta.validation.Valid;
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
  public MenuCreatedResponseDto create(@Valid @RequestBody MenuCreateRequestDto request) {
    return menuService.create(request);
  }

  // 메뉴 목록. 쿼리스트링의 조건(?categoryId=&status=&keyword=&ownerRecommended=&sort=&size=)으로 거른다. 조건이 없으면 전체
  @GetMapping
  public List<MenuListResponseDto> getList(@ModelAttribute MenuListRequestDto request) {
    return menuService.getList(request);
  }

  // 메뉴 화면의 카테고리 칩·선택 상자 (곁다리 데이터)
  @GetMapping("/categories")
  public List<MenuCategoryListResponseDto> getCategories() {
    return menuService.getCategories();
  }

  // 상태별 메뉴 수 (전체·판매중·품절·숨김). ?categoryId=가 있으면 그 카테고리 안에서만 센다
  @GetMapping("/summary")
  public MenuSummaryResponseDto getSummary(@RequestParam(required = false) Long categoryId) {
    return menuService.getSummary(categoryId);
  }

  // 메뉴 상세. 없는 id면 404
  @GetMapping("/{id}")
  public MenuDetailResponseDto getDetail(@PathVariable Long id) {
    return menuService.getDetail(id);
  }

  // 메뉴 수정. id는 경로에서 받고, 본문의 값으로 덮어쓴다
  @PutMapping("/{id}")
  public MenuUpdatedResponseDto update(@PathVariable Long id, @Valid @RequestBody MenuUpdateRequestDto request) {
    return menuService.update(id, request);
  }

  // 메뉴 삭제. 성공하면 본문 없이 204
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    menuService.delete(id);
  }
}
