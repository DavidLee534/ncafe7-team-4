package com.newcafe.backend.controller.my;

import com.newcafe.backend.dto.my.recipe.MyRecipeDetailResponseDto;
import com.newcafe.backend.dto.my.recipe.MyRecipeListResponseDto;
import com.newcafe.backend.dto.my.recipe.MyRecipeSummaryResponseDto;
import com.newcafe.backend.service.my.RecipeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 회원 도감 · 내가 빚은 포션. 다른 시스템에 같은 이름의 컨트롤러가 생길 수 있어 빈 이름을 붙인다
@RestController("myRecipeController")
@RequestMapping("/api/v1/my/recipes")
@RequiredArgsConstructor
public class RecipeController {

  private final RecipeService recipeService;

  // 내가 빚은 포션 목록 (최근에 만든 것부터)
  @GetMapping
  public List<MyRecipeListResponseDto> getList() {
    return recipeService.getList();
  }

  // 도감 상단 숫자 (포션 수, 비밀 레시피 찾은/전체, 전설, 진행률)
  @GetMapping("/summary")
  public MyRecipeSummaryResponseDto getSummary() {
    return recipeService.getSummary();
  }

  // 내 포션 상세. 없거나 남의 포션이면 404
  @GetMapping("/{id}")
  public MyRecipeDetailResponseDto getDetail(@PathVariable Long id) {
    return recipeService.getDetail(id);
  }
}
