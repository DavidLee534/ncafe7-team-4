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
import com.newcafe.backend.repository.CartItemRepository;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.MenuRepository;
import com.newcafe.backend.repository.RecipeRepository;
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
  private final RecipeRepository recipeRepository;
  private final CartItemRepository cartItemRepository;

  @Override
  @Transactional
  public MenuCreatedResponseDto create(MenuCreateRequestDto request) {
    Category category = findCategory(request.categoryId());
    if (request.slug() != null && menuRepository.existsBySlug(request.slug())) {
      throw new IllegalStateException("이미 쓰고 있는 slug입니다: " + request.slug());
    }
    Menu saved = menuRepository.save(request.toEntity(category));
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
    String slug = request.slug() != null ? request.slug() : menu.getSlug();
    if (slug != null && menuRepository.existsBySlugAndIdNot(slug, id)) {
      throw new IllegalStateException("이미 쓰고 있는 slug입니다: " + slug);
    }
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

  // 회원이 만든 포션의 기반 메뉴면 지울 수 없다(409) → 대신 숨김(hidden)으로 바꾼다
  // 장바구니에 담긴 줄은 임시 데이터라 메뉴와 함께 지운다. 지난 주문(OrderItem)은 메뉴를 참조하지 않아 영향 없음
  @Override
  @Transactional
  public void delete(Long id) {
    Menu menu = findMenu(id);
    if (recipeRepository.existsByBaseMenuId(id)) {
      throw new IllegalStateException("회원이 만든 포션에 쓰인 메뉴는 삭제할 수 없습니다. 판매 상태를 숨김으로 바꾸세요: " + menu.getKorName());
    }
    cartItemRepository.deleteAllByMenuId(id);
    menuRepository.delete(menu);
  }

  // 없는 id면 NotFoundException(404)
  private Menu findMenu(Long id) {
    return menuRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + id));
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }

  // 없는 id면 NotFoundException(404). 등록·수정 요청은 categoryId가 필수라(@NotNull) null은 들어오지 않는다
  private Category findCategory(Long categoryId) {
    if (categoryId == null) {
      return null;
    }
    return categoryRepository.findById(categoryId)
        .orElseThrow(() -> new NotFoundException("카테고리를 찾을 수 없습니다: " + categoryId));
  }
}
