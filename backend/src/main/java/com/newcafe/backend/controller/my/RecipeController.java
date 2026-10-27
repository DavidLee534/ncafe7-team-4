package com.newcafe.backend.controller.my;

import com.newcafe.backend.dto.my.recipe.MyRecipeListResponseDto;
import com.newcafe.backend.service.my.MyPageService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("myRecipeController")
@RequestMapping("/api/v1/my/recipes")
@RequiredArgsConstructor
public class RecipeController {
  private final MyPageService service;

  @GetMapping
  public List<MyRecipeListResponseDto> getList() { return service.getRecipes(); }
}
