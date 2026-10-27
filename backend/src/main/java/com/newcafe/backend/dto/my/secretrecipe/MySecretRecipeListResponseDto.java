package com.newcafe.backend.dto.my.secretrecipe;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipeDiscovery;
import java.time.LocalDateTime;

// GET /api/v1/my/secret-recipes 응답의 한 줄 (회원 도감 · 비밀 레시피 탭)
// 발견하지 않은 레시피는 이름·설명을 응답에서 빼고(null) 수수께끼만 준다. 응답만 봐도 정답이 보이면 안 되기 때문
// 발견한 레시피는 반대로 이름·설명을 주고 수수께끼는 뺀다
public record MySecretRecipeListResponseDto(
    Long id,
    String grade,
    Long categoryId,
    String categoryName,
    String color,
    boolean discovered,
    LocalDateTime discoveredAt,
    String name,
    String description,
    String riddle
) {
  // discovery 가 null 이면 아직 발견하지 않은 레시피
  public static MySecretRecipeListResponseDto from(SecretRecipe recipe, SecretRecipeDiscovery discovery) {
    Category category = recipe.getCategory();
    boolean discovered = discovery != null;
    return new MySecretRecipeListResponseDto(
        recipe.getId(),
        recipe.getGrade(),
        category != null ? category.getId() : null,
        category != null ? category.getName() : null,
        recipe.getColor(),
        discovered,
        discovered ? discovery.getDiscoveredAt() : null,
        discovered ? recipe.getName() : null,
        discovered ? recipe.getDescription() : null,
        discovered ? null : recipe.getRiddle()
    );
  }
}
