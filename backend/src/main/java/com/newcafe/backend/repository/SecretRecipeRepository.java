package com.newcafe.backend.repository;

import com.newcafe.backend.entity.SecretRecipe;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface SecretRecipeRepository extends JpaRepository<SecretRecipe, Long> {

  // 이 카테고리(계열)에 속한 비밀 레시피가 있는지. 있으면 관리자가 카테고리를 지울 수 없다
  boolean existsByCategoryId(Long categoryId);

  // 연금 공방에서 맞힌 조합의 비밀 레시피를 이름으로 찾는다 (재료 관리 머지 전 임시)
  Optional<SecretRecipe> findByName(String name);
}
