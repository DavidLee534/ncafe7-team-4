package com.newcafe.backend.entity;

import jakarta.persistence.*;
import lombok.*;

// 회원 포션(Recipe)에 들어간 재료 한 가지 (README "potion_ingredient")
// 기반 재료와 추가 재료를 모두 한 줄씩 남긴다. 포션에 쓰인 재료는 관리자가 지울 수 없다(409)
@Entity
@Table(name = "recipe_ingredients")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecipeIngredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "recipe_id", nullable = false)
  private Recipe recipe;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "ingredient_id", nullable = false)
  private Ingredient ingredient;

  @Builder
  private RecipeIngredient(Recipe recipe, Ingredient ingredient) {
    this.recipe = recipe;
    this.ingredient = ingredient;
  }
}
