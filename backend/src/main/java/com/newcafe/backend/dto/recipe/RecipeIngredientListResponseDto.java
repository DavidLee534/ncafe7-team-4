package com.newcafe.backend.dto.recipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.service.AlchemyRules;
import java.util.List;

// GET /api/v1/recipes/ingredients 응답의 한 줄 (계열 하나의 재료 선반)
// bases 는 그 계열의 필수 재료(판매 중 메뉴 하나에 재료 하나), extras 는 더할 수 있는 추가 재료
// 필수 재료의 가격은 그 메뉴 가격이다
public record RecipeIngredientListResponseDto(
    Long categoryId,
    String categoryName,
    String spell,
    List<Base> bases,
    List<Extra> extras
) {
  public record Base(Long menuId, String ingredientName, String menuName, Integer price) {
  }

  public record Extra(String name, String icon, Integer price) {
  }

  public static RecipeIngredientListResponseDto from(Category category, AlchemyRules.Shelf shelf, List<Menu> menus) {
    return new RecipeIngredientListResponseDto(
        category.getId(),
        category.getName(),
        shelf.spell(),
        menus.stream()
            .map(menu -> new Base(menu.getId(), AlchemyRules.baseIngredientOf(menu), menu.getKorName(), menu.getPrice()))
            .toList(),
        shelf.extras().stream()
            .map(extra -> new Extra(extra.name(), extra.icon(), extra.price()))
            .toList()
    );
  }
}
