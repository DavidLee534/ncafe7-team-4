package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuCreatedResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdatedResponseDto;
import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfMenuService implements MenuService {

  private final MenuRepository menuRepository;
  private final CategoryRepository categoryRepository;

  @Override
  @Transactional
  public MenuCreatedResponseDto create(MenuCreateRequestDto request) {
    Category category = findCategory(request.categoryId());
    Menu saved = menuRepository.save(request.toEntity(category));
    return MenuCreatedResponseDto.from(saved);
  }

  @Override
  public List<MenuListResponseDto> getList() {
    return menuRepository.findAll().stream()
        .map(MenuListResponseDto::from)
        .toList();
  }

  @Override
  public MenuDetailResponseDto getDetail(Long id) {
    return MenuDetailResponseDto.from(findMenu(id));
  }

  // 조회한 메뉴의 값을 바꾸면 트랜잭션이 끝날 때 UPDATE 된다
  @Override
  @Transactional
  public MenuUpdatedResponseDto update(Long id, MenuUpdateRequestDto request) {
    Menu menu = findMenu(id);
    Category category = findCategory(request.categoryId());
    menu.update(
        request.korName(),
        request.engName(),
        request.price(),
        category,
        request.status() != null ? request.status() : menu.getStatus(),
        request.ownerRecommended() != null ? request.ownerRecommended() : menu.isOwnerRecommended(),
        request.description());
    return MenuUpdatedResponseDto.from(menu);
  }

  @Override
  @Transactional
  public void delete(Long id) {
    menuRepository.delete(findMenu(id));
  }

  // 없는 id면 NotFoundException(404)
  private Menu findMenu(Long id) {
    return menuRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + id));
  }

  // categoryId를 비우면 카테고리 없음(null). 없는 id면 NotFoundException(404)
  private Category findCategory(Long categoryId) {
    if (categoryId == null) {
      return null;
    }
    return categoryRepository.findById(categoryId)
        .orElseThrow(() -> new NotFoundException("카테고리를 찾을 수 없습니다: " + categoryId));
  }
}
