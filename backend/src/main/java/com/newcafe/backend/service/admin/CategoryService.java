package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.category.CategoryCreateRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryCreatedResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryDetailResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryListResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryOrderRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryUpdateRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryUpdatedResponseDto;

import java.util.List;

// 관리자 카테고리 관리 업무. 구현체는 DfCategoryService
// 컨트롤러와는 DTO로만 주고받고, 엔티티는 서비스 안에서만 다룬다
// 메서드 이름은 카테고리만 다루는 캡슐이므로 Category를 다시 붙이지 않는다 (getList, getDetail ...)
public interface CategoryService {

  CategoryCreatedResponseDto create(CategoryCreateRequestDto request);

  List<CategoryListResponseDto> getList();

  CategoryDetailResponseDto getDetail(Long id);

  CategoryUpdatedResponseDto update(Long id, CategoryUpdateRequestDto request);

  List<CategoryListResponseDto> changeOrder(CategoryOrderRequestDto request);

  void delete(Long id);
}
