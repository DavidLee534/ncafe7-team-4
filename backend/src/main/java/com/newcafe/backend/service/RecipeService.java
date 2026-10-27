package com.newcafe.backend.service;

import com.newcafe.backend.dto.recipe.RecipeCreateRequestDto;
import com.newcafe.backend.dto.recipe.RecipeCreatedResponseDto;
import com.newcafe.backend.dto.recipe.RecipeEmotionListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeIngredientListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeMenuListRequestDto;
import com.newcafe.backend.dto.recipe.RecipeMenuListResponseDto;
import com.newcafe.backend.dto.recipe.RecipeRecommendationRequestDto;
import com.newcafe.backend.dto.recipe.RecipeRecommendationResponseDto;

import java.util.List;

// 레시피 등록(연금 공방) 업무. 구현체는 DfRecipeService
// 포션 만들기와 세 화면(재료로 · 감정으로 · 기본 메뉴 고르기)의 곁다리 조회를 맡는다
public interface RecipeService {

  RecipeCreatedResponseDto create(RecipeCreateRequestDto request);

  List<RecipeIngredientListResponseDto> getIngredients();

  RecipeEmotionListResponseDto getEmotions();

  List<RecipeRecommendationResponseDto> getRecommendations(RecipeRecommendationRequestDto request);

  List<RecipeMenuListResponseDto> getMenus(RecipeMenuListRequestDto request);
}
