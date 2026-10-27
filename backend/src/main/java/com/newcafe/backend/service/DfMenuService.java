package com.newcafe.backend.service;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.menu.MenuCategoryListResponseDto;
import com.newcafe.backend.dto.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.menu.MenuListRequestDto;
import com.newcafe.backend.dto.menu.MenuListResponseDto;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// 관리자 DfMenuService 와 클래스 이름이 같아서 빈 이름을 따로 붙인다
@Service("publicMenuService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfMenuService implements MenuService {

  private final MenuRepository menuRepository;
  private final CategoryRepository categoryRepository;

  // 빈 문자열 조건(?keyword=)은 조건 없음(null)으로 바꿔서 넘긴다
  @Override
  public List<MenuListResponseDto> getList(MenuListRequestDto request) {
    return menuRepository.findAllPublic(request.categoryId(), null, blankToNull(request.keyword())).stream()
        .map(MenuListResponseDto::from)
        .toList();
  }

  // 손님에게 보이는 카테고리를 화면 순서대로. 메뉴 수는 손님에게 보이는 메뉴만 센다
  @Override
  public List<MenuCategoryListResponseDto> getCategories() {
    Map<Long, Long> counts = menuRepository.findAllPublic(null, null, null).stream()
        .collect(Collectors.groupingBy(menu -> menu.getCategory().getId(), Collectors.counting()));
    return categoryRepository.findAllByOrderBySortOrderAscIdAsc().stream()
        .filter(category -> category.isVisible())
        .map(category -> MenuCategoryListResponseDto.from(category, counts.getOrDefault(category.getId(), 0L)))
        .toList();
  }

  // 사장 추천 메뉴 (관리자가 "사장 추천 메뉴로 표시"를 켠 메뉴)
  @Override
  public List<MenuListResponseDto> getRecommendations() {
    return menuRepository.findAllPublic(null, true, null).stream()
        .map(MenuListResponseDto::from)
        .toList();
  }

  // 없는 slug, 숨김 메뉴, 숨긴 카테고리의 메뉴면 NotFoundException(404)
  @Override
  public MenuDetailResponseDto getDetail(String slug) {
    Menu menu = menuRepository.findPublicBySlug(slug)
        .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + slug));
    return MenuDetailResponseDto.from(menu);
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }
}
