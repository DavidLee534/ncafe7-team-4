package com.newcafe.backend.service.my;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.my.cart.*;
import com.newcafe.backend.entity.CartItem;
import com.newcafe.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DfMyCartService implements MyCartService {
  private final CurrentMember currentMember;
  private final MemberRepository members;
  private final MenuRepository menus;
  private final RecipeRepository recipes;
  private final CartItemRepository cartItems;

  @Transactional
  public CartItemCreatedResponseDto add(CartItemCreateRequestDto request) {
    if ((request.menuId() == null) == (request.recipeId() == null))
      throw new IllegalArgumentException("메뉴 또는 포션 하나를 선택하세요.");
    int quantity = request.quantity() == null ? 1 : request.quantity();
    if (quantity < 1 || quantity > 20) throw new IllegalArgumentException("수량은 1~20개여야 합니다.");
    var member = members.findById(currentMember.id())
        .orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다: " + currentMember.id()));
    if (!"active".equals(member.getStatus())) throw new ForbiddenException("활성 회원만 이용할 수 있습니다.");
    CartItem item;
    if (request.recipeId() != null) {
      var recipe = recipes.findById(request.recipeId())
          .orElseThrow(() -> new NotFoundException("포션을 찾을 수 없습니다: " + request.recipeId()));
      item = cartItems.findByMemberIdAndRecipeId(member.getId(), recipe.getId()).orElse(null);
      if (item == null) item = CartItem.builder().member(member).recipe(recipe).quantity(quantity).build();
      else item.addQuantity(quantity);
    } else {
      var menu = menus.findById(request.menuId())
          .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + request.menuId()));
      if (!"on".equals(menu.getStatus())) throw new IllegalStateException("판매 중인 메뉴만 담을 수 있습니다.");
      item = cartItems.findByMemberIdAndMenuId(member.getId(), menu.getId()).orElse(null);
      if (item == null) item = CartItem.builder().member(member).menu(menu).quantity(quantity).build();
      else item.addQuantity(quantity);
    }
    if (item.getQuantity() > 20) throw new IllegalStateException("한 상품은 최대 20개까지 담을 수 있습니다.");
    var saved = cartItems.save(item);
    return new CartItemCreatedResponseDto(saved.getId(),
        saved.getMenu() == null ? null : saved.getMenu().getId(),
        saved.getRecipe() == null ? null : saved.getRecipe().getId(),
        saved.getMenu() == null ? saved.getRecipe().getName() : saved.getMenu().getKorName(),
        saved.unitPrice(), saved.getQuantity());
  }
}
