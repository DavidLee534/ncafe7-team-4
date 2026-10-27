package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "secret_recipes", uniqueConstraints = @UniqueConstraint(name = "uk_secret_recipes_ingredient_combo", columnNames = "ingredient_combo"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SecretRecipe {

  public enum Grade {
    rare, legend
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(length = 1000)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private Grade grade;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "base_ingredient_id", nullable = false)
  private Ingredient baseIngredient;

  @Column(name = "ingredient_combo", nullable = false, length = 500)
  private String ingredientCombo;

  @Column(length = 1000)
  private String riddle;

  @Column(length = 7)
  private String color;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  public SecretRecipe(String name, String description, Grade grade, Ingredient baseIngredient,
      String ingredientCombo, String riddle, String color) {
    update(name, description, grade, baseIngredient, ingredientCombo, riddle, color);
  }

  public void update(String name, String description, Grade grade, Ingredient baseIngredient,
      String ingredientCombo, String riddle, String color) {
    this.name = name;
    this.description = description;
    this.grade = grade;
    this.baseIngredient = baseIngredient;
    this.ingredientCombo = ingredientCombo;
    this.riddle = riddle;
    this.color = color;
    this.updatedAt = LocalDateTime.now();
  }

  @PrePersist
  private void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }
}
