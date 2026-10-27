package com.newcafe.backend.dto.recipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Ingredient;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.service.AlchemyRules;
import java.util.List;
import java.util.Map;

// GET /api/v1/recipes/ingredients 응답의 한 줄 (계열 하나의 재료 선반)
// bases 는 그 계열의 기반 재료(판매 중 메뉴 하나에 재료 하나, 가격은 그 메뉴 가격)
// shelves 는 그 계열에 열리는 추가 재료 선반. 선반마다 고를 수 있는 개수(min~max)가 있고,
// group 이 같은 재료(티 블렌딩의 과일청 · 허브)는 묶음마다 하나까지만 고른다
public record RecipeIngredientListResponseDto(
    Long categoryId,
    String categoryName,
    String spell,
    List<Base> bases,
    List<Shelf> shelves
) {

  // ingredientId 는 재료 테이블에 기반 재료가 없는 메뉴(관리자가 새로 등록한 메뉴)면 null
  public record Base(Long menuId, Long ingredientId, String ingredientName, String menuName, String alchemyName, Integer price) {
  }

  public record Shelf(String name, String icon, int min, int max, List<Extra> extras) {
  }

  public record Extra(Long id, String name, Integer price, String color, String modifier, String group) {
  }

  // menus 는 이 계열의 판매 중 메뉴, basesByName 은 기반 재료(이름 → 재료), extrasByShelf 는 손님에게 보이는 추가 재료(선반 → 재료)
  public static RecipeIngredientListResponseDto from(
      Category category, List<Menu> menus, Map<String, Ingredient> basesByName, Map<String, List<Ingredient>> extrasByShelf) {
    AlchemyRules.Line line = AlchemyRules.lineOf(category);
    return new RecipeIngredientListResponseDto(
        category.getId(),
        category.getName(),
        line.spell(),
        menus.stream()
            .map(menu -> {
              String name = AlchemyRules.baseIngredientNameOf(menu);
              Ingredient base = basesByName.get(name);
              return new Base(menu.getId(), base != null ? base.getId() : null, name, menu.getKorName(),
                  AlchemyRules.alchemyNameOf(menu), menu.getPrice());
            })
            .toList(),
        line.shelves().stream()
            .map(shelf -> {
              AlchemyRules.Limit limit = AlchemyRules.limitOf(shelf);
              List<Extra> extras = extrasByShelf.getOrDefault(shelf, List.of()).stream()
                  .filter(extra -> !line.excluded().contains(extra.getName()))
                  .map(extra -> new Extra(extra.getId(), extra.getName(), extra.getPrice(), extra.getColor(),
                      extra.getModifier(), AlchemyRules.groupOf(extra)))
                  .toList();
              return new Shelf(shelf, AlchemyRules.iconOf(shelf), limit.min(), limit.max(), extras);
            })
            .toList()
    );
  }
}
