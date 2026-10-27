package com.newcafe.backend.controller;

import com.newcafe.backend.dto.recipe.RecipeCreateRequestDto;
import com.newcafe.backend.dto.recipe.RecipeCreatedResponseDto;
import com.newcafe.backend.dto.recipe.RecipeEmotionListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeIngredientListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeMenuListRequestDto;
import com.newcafe.backend.dto.recipe.RecipeMenuListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeRecommendationRequestDto;
import com.newcafe.backend.dto.recipe.RecipeRecommendationResponseDto;
import com.newcafe.backend.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recipes")
@RequiredArgsConstructor
public class RecipeController {

  private final RecipeService recipeService;

  // 포션 만들기 → 현재 회원의 도감에 저장. 성공하면 201과 만든 포션 (이름 · 등급 · 가격, 비밀 레시피를 맞혔는지)
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public RecipeCreatedResponseDto create(@Valid @RequestBody RecipeCreateRequestDto request) {
    return recipeService.create(request);
  }

  // 재료로 만들기 화면의 재료 선반 (계열마다 기반 메뉴 · 추가 재료)
  @GetMapping("/ingredients")
  public List<RecipeIngredientListResponseDto> getIngredients() {
    return recipeService.getIngredients();
  }

  // 감정으로 만들기 화면의 감정 · 맛 목록
  @GetMapping("/emotions")
  public RecipeEmotionListResponseDto getEmotions() {
    return recipeService.getEmotions();
  }

  // 감정 추천 (?emotion=피곤함&tastes=달콤한,시원한). 감정이 없거나 모르는 값이면 400
  @GetMapping("/recommendations")
  public List<RecipeRecommendationResponseDto> getRecommendations(@ModelAttribute RecipeRecommendationRequestDto request) {
    return recipeService.getRecommendations(request);
  }

  // 기본 메뉴 고르기 화면의 메뉴 목록 (?categoryId=). 숨김 메뉴는 빼고, 품절 메뉴는 status로 알려 준다
  @GetMapping("/menus")
  public List<RecipeMenuListResponseDto> getMenus(@ModelAttribute RecipeMenuListRequestDto request) {
    return recipeService.getMenus(request);
  }
}
