package com.newcafe.backend.repository;

import com.newcafe.backend.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {

  // 이 재료가 들어간 회원 포션이 있는지. 있으면 재료를 삭제할 수 없다
  boolean existsByIngredientId(Long ingredientId);
}
