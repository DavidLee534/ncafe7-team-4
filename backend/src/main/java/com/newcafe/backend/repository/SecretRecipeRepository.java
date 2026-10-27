package com.newcafe.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.newcafe.backend.entity.SecretRecipe;

public interface SecretRecipeRepository extends JpaRepository<SecretRecipe, Long> {
  List<SecretRecipe> findAllByOrderByIdDesc();

  @Override
  @EntityGraph(attributePaths = "baseIngredient")
  java.util.Optional<SecretRecipe> findById(Long id);

  boolean existsByIngredientCombo(String ingredientCombo);

  boolean existsByIngredientComboAndIdNot(String ingredientCombo, Long id);
}
