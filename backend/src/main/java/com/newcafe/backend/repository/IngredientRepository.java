package com.newcafe.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newcafe.backend.entity.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
}
