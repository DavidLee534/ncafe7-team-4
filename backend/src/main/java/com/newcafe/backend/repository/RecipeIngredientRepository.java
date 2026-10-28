package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Ingredient;
import com.newcafe.backend.entity.RecipeIngredient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {

  // 이 재료가 들어간 회원 포션이 있는지. 있으면 재료를 삭제할 수 없다
  boolean existsByIngredientId(Long ingredientId);

  // 이 포션에 들어간 재료 (넣은 순서대로). 회원 도감 · 내 포션 상세에서 쓴다
  @Query("select ri.ingredient from RecipeIngredient ri where ri.recipe.id = :recipeId order by ri.id")
  List<Ingredient> findIngredientsByRecipeId(@Param("recipeId") Long recipeId);
}
