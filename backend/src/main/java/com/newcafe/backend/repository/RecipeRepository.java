package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

  // 이 메뉴를 기반으로 만든 포션이 있는지. 있으면 관리자가 메뉴를 지울 수 없다
  boolean existsByBaseMenuId(Long menuId);

  // 이 비밀 레시피를 맞혀서 만든 포션이 있는지. 있으면 관리자가 비밀 레시피를 지울 수 없다
  boolean existsBySecretRecipeId(Long secretRecipeId);
}
