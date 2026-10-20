package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.category.CategoryCreateRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryCreatedResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryDetailResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryListResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryOrderRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryUpdateRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryUpdatedResponseDto;
import com.newcafe.backend.service.admin.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService categoryService;

  // 카테고리 생성. 성공하면 201과 저장된 카테고리. 같은 이름이 있으면 409
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CategoryCreatedResponseDto create(@RequestBody CategoryCreateRequestDto request) {
    return categoryService.create(request);
  }

  // 카테고리 목록. 화면 순서(sortOrder)대로, 카테고리별 메뉴 수(menuCount) 포함
  @GetMapping
  public List<CategoryListResponseDto> getList() {
    return categoryService.getList();
  }

  // 카테고리 상세. 없는 id면 404
  @GetMapping("/{id}")
  public CategoryDetailResponseDto getDetail(@PathVariable Long id) {
    return categoryService.getDetail(id);
  }

  // 카테고리 수정. id는 경로에서 받고, 본문의 값으로 덮어쓴다
  @PutMapping("/{id}")
  public CategoryUpdatedResponseDto update(@PathVariable Long id, @RequestBody CategoryUpdateRequestDto request) {
    return categoryService.update(id, request);
  }

  // 목록의 "순서 저장". 바뀐 순서의 전체 목록을 돌려준다
  @PatchMapping("/order")
  public List<CategoryListResponseDto> changeOrder(@RequestBody CategoryOrderRequestDto request) {
    return categoryService.changeOrder(request);
  }

  // 카테고리 삭제. 성공하면 본문 없이 204. 메뉴가 남아 있으면 409
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    categoryService.delete(id);
  }
}
