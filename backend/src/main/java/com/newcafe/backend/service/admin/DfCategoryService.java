package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.category.CategoryCreateRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryOrderRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryCreatedResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryDetailResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryListResponseDto;
import com.newcafe.backend.dto.admin.category.CategoryUpdateRequestDto;
import com.newcafe.backend.dto.admin.category.CategoryUpdatedResponseDto;
import com.newcafe.backend.entity.Category;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.MenuRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfCategoryService implements CategoryService {

  private final CategoryRepository categoryRepository;
  private final MenuRepository menuRepository;
  private final SecretRecipeRepository secretRecipeRepository;

  // 같은 이름이 있으면 409. sortOrder를 비우면 맨 뒤에 붙인다
  @Override
  @Transactional
  public CategoryCreatedResponseDto create(CategoryCreateRequestDto request) {
    if (categoryRepository.existsByName(request.name())) {
      throw new IllegalStateException("이미 있는 카테고리 이름입니다: " + request.name());
    }
    int lastOrder = categoryRepository.findMaxSortOrder();
    Category saved = categoryRepository.save(request.toEntity(lastOrder + 1));
    return CategoryCreatedResponseDto.from(saved, countMenus(saved));
  }

  // 화면 순서(sortOrder)대로
  @Override
  public List<CategoryListResponseDto> getList() {
    return categoryRepository.findAllByOrderBySortOrderAscIdAsc().stream()
        .map(category -> CategoryListResponseDto.from(category, countMenus(category)))
        .toList();
  }

  @Override
  public CategoryDetailResponseDto getDetail(Long id) {
    Category category = findCategory(id);
    return CategoryDetailResponseDto.from(category, countMenus(category));
  }

  // 다른 카테고리와 이름이 겹치면 409
  @Override
  @Transactional
  public CategoryUpdatedResponseDto update(Long id, CategoryUpdateRequestDto request) {
    Category category = findCategory(id);
    if (categoryRepository.existsByNameAndIdNot(request.name(), id)) {
      throw new IllegalStateException("이미 있는 카테고리 이름입니다: " + request.name());
    }
    category.update(
        request.name(),
        request.engName(),
        request.sortOrder() != null ? request.sortOrder() : category.getSortOrder(),
        request.visible() != null ? request.visible() : category.isVisible());
    return CategoryUpdatedResponseDto.from(category, countMenus(category));
  }

  // 받은 id 순서대로 sortOrder를 1, 2, 3 ... 으로 다시 매긴다
  // 전체 카테고리를 빠짐없이, 중복 없이 보내야 한다. 아니면 409
  @Override
  @Transactional
  public List<CategoryListResponseDto> changeOrder(CategoryOrderRequestDto request) {
    List<Long> ids = request.categoryIds();
    Map<Long, Category> categories = categoryRepository.findAll().stream()
        .collect(Collectors.toMap(Category::getId, Function.identity()));

    if (ids == null || ids.size() != categories.size()
        || !categories.keySet().equals(new HashSet<>(ids))) {
      throw new IllegalStateException("전체 카테고리의 id를 한 번씩 보내야 합니다.");
    }

    for (int i = 0; i < ids.size(); i++) {
      categories.get(ids.get(i)).changeSortOrder(i + 1);
    }
    return getList();
  }

  // 메뉴나 비밀 레시피가 남아 있으면 409. 다른 카테고리로 옮기거나 지운 뒤에 삭제할 수 있다
  @Override
  @Transactional
  public void delete(Long id) {
    Category category = findCategory(id);
    if (countMenus(category) > 0) {
      throw new IllegalStateException("메뉴가 있는 카테고리는 삭제할 수 없습니다: " + category.getName());
    }
    if (secretRecipeRepository.existsByCategoryId(id)) {
      throw new IllegalStateException("비밀 레시피가 있는 카테고리는 삭제할 수 없습니다: " + category.getName());
    }
    categoryRepository.delete(category);
  }

  // 없는 id면 NotFoundException(404)
  private Category findCategory(Long id) {
    return categoryRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("카테고리를 찾을 수 없습니다: " + id));
  }

  private long countMenus(Category category) {
    return menuRepository.countByCategoryId(category.getId());
  }
}
