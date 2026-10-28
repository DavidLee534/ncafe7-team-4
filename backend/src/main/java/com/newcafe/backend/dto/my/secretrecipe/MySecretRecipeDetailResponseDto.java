package com.newcafe.backend.dto.my.secretrecipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipeDiscovery;
import java.time.LocalDateTime;
import java.util.List;

// GET /api/v1/my/secret-recipes/{id} 응답 (회원 도감 · 비밀 레시피 상세)
// 목록 값 + customerRate (이 레시피를 찾은 회원 비율 %, 소수 첫째 자리)
// 목록과 같이 발견 전에는 이름·설명이 null, 발견 후에는 수수께끼가 null
// 재료 조합: 발견 전에는 재료 개수(ingredientCount)만, 발견 후에는 재료 이름(ingredients, 기반 재료 먼저)도 준다
public record MySecretRecipeDetailResponseDto(
    Long id,
    String grade,
    Long categoryId,
    String categoryName,
    String color,
    boolean discovered,
    LocalDateTime discoveredAt,
    String name,
    String description,
    String riddle,
    double customerRate,
    int ingredientCount,
    List<String> ingredients
) {
  public static MySecretRecipeDetailResponseDto from(
      SecretRecipe recipe, SecretRecipeDiscovery discovery, double customerRate, List<String> ingredients) {
    Category category = recipe.getCategory();
    boolean discovered = discovery != null;
    return new MySecretRecipeDetailResponseDto(
        recipe.getId(),
        recipe.getGrade(),
        category != null ? category.getId() : null,
        category != null ? category.getName() : null,
        recipe.getColor(),
        discovered,
        discovered ? discovery.getDiscoveredAt() : null,
        discovered ? recipe.getName() : null,
        discovered ? recipe.getDescription() : null,
        discovered ? null : recipe.getRiddle(),
        customerRate,
        ingredients.size(),
        discovered ? ingredients : null
    );
  }
}
