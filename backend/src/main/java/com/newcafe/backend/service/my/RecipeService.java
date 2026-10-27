package com.newcafe.backend.service.my;

import com.newcafe.backend.dto.my.recipe.MyRecipeDetailResponseDto;
import com.newcafe.backend.dto.my.recipe.MyRecipeListResponseDto;
import com.newcafe.backend.dto.my.recipe.MyRecipeSummaryResponseDto;
import java.util.List;

// 회원 도감 · 내가 빚은 포션. 구현체는 DfRecipeService(빈 이름 myRecipeService)
// "현재 회원"은 CurrentMember 에서 받는다 (인증 전까지 1번 회원)
public interface RecipeService {

  List<MyRecipeListResponseDto> getList();

  MyRecipeDetailResponseDto getDetail(Long id);

  MyRecipeSummaryResponseDto getSummary();
}
