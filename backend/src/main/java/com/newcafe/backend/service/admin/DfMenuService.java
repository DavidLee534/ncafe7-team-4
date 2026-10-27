package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.menu.MenuCategoryListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuCreatedResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuDetailResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuListRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuListResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuSummaryResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdatedResponseDto;
import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    Menu saved = menuRepository.save(request.toEntity(category, newSlug(request.engName())));
    return MenuCreatedResponseDto.from(saved);
  }

  // 빈 문자열 조건(?keyword=)은 조건 없음(null)으로 바꿔서 넘긴다
  // sort=updatedAt이면 최근 수정순, 그 밖에는 등록순(id). size가 있으면 앞에서부터 그 개수만
  // 수정일이 비어 있는 예전 메뉴는 맨 뒤로 보낸다 (PostgreSQL은 내림차순에서 null을 맨 앞에 둔다)
  @Override
  public List<MenuListResponseDto> getList(MenuListRequestDto request) {
    Sort sort = "updatedAt".equals(request.sort())
        ? Sort.by(Sort.Order.desc("updatedAt").nullsLast(), Sort.Order.desc("id"))
        : Sort.by("id");
    Pageable pageable = request.size() != null && request.size() > 0
        ? PageRequest.of(0, request.size(), sort)
        : Pageable.unpaged(sort);

    return menuRepository.findAllByCondition(
        request.categoryId(),
        blankToNull(request.status()),
        request.ownerRecommended(),
        blankToNull(request.keyword()),
        pageable)
        .stream()
        .map(MenuListResponseDto::from)
        .toList();
  }

  @Override
  public MenuDetailResponseDto getDetail(Long id) {
    return MenuDetailResponseDto.from(findMenu(id));
  }

  // 메뉴 화면의 카테고리 칩·선택 상자. 화면 순서(sortOrder)대로, 카테고리별 메뉴 수 포함
  @Override
  public List<MenuCategoryListResponseDto> getCategories() {
    return categoryRepository.findAllByOrderBySortOrderAscIdAsc().stream()
        .map(category -> MenuCategoryListResponseDto.from(
            category, menuRepository.countByCategoryId(category.getId())))
        .toList();
  }

  // 메뉴를 상태별로 센다. categoryId가 있으면 그 카테고리 안에서만, 없으면 전체
  @Override
  public MenuSummaryResponseDto getSummary(Long categoryId) {
    if (categoryId == null) {
      return new MenuSummaryResponseDto(
          menuRepository.count(),
          menuRepository.countByStatus("on"),
          menuRepository.countByStatus("soldout"),
          menuRepository.countByStatus("hidden"));
    }
    return new MenuSummaryResponseDto(
        menuRepository.countByCategoryId(categoryId),
        menuRepository.countByCategoryIdAndStatus(categoryId, "on"),
        menuRepository.countByCategoryIdAndStatus(categoryId, "soldout"),
        menuRepository.countByCategoryIdAndStatus(categoryId, "hidden"));
  }

  // 조회한 메뉴의 값을 바꾸면 트랜잭션이 끝날 때 UPDATE 된다
  @Override
  @Transactional
  public MenuUpdatedResponseDto update(Long id, MenuUpdateRequestDto request) {
    Menu menu = findMenu(id);
    Category category = findCategory(request.categoryId());
    // 이미 있는 slug는 그대로 둔다. 예전 메뉴처럼 비어 있으면 이번에 만든다
    String slug = menu.getSlug() != null ? menu.getSlug() : newSlug(request.engName());
    menu.update(
        request.korName(),
        request.engName(),
        request.price(),
        category,
        request.status() != null ? request.status() : menu.getStatus(),
        request.ownerRecommended() != null ? request.ownerRecommended() : menu.isOwnerRecommended(),
        request.description(),
        slug,
        request.emotionTagsOr(menu.getEmotionTags()),
        request.tasteTagsOr(menu.getTasteTags()));
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

  // 영문 이름으로 사용자 메뉴 주소(slug)를 만든다. "Caffe Latte" → "caffe-latte"
  // 영문·숫자 말고는 하이픈으로 바꾸고, 다른 메뉴가 이미 쓰고 있으면 뒤에 -2, -3 ... 을 붙인다
  private String newSlug(String engName) {
    String base = engName.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    if (base.isEmpty()) {
      base = "menu";
    }
    if (base.length() > 50) {
      base = base.substring(0, 50).replaceAll("-$", "");
    }
    String slug = base;
    for (int n = 2; menuRepository.existsBySlug(slug); n++) {
      slug = base + "-" + n;
    }
    return slug;
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }

  // 없는 id면 NotFoundException(404). 등록·수정 요청은 categoryId가 필수라(@NotNull) null은 들어오지
  // 않는다
  private Category findCategory(Long categoryId) {
    if (categoryId == null) {
      return null;
    }
    return categoryRepository.findById(categoryId)
        .orElseThrow(() -> new NotFoundException("카테고리를 찾을 수 없습니다: " + categoryId));
  }
}
