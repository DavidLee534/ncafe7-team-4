package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Menu;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {

  // 메뉴 목록을 카테고리와 함께 한 번에 가져온다.
  // 이게 없으면 메뉴마다 카테고리 이름을 꺼낼 때 카테고리 조회가 따로 나간다 (N+1)
  @Override
  @EntityGraph(attributePaths = "category")
  List<Menu> findAll();

  // 카테고리에 속한 메뉴 수. 메뉴가 있는 카테고리는 삭제를 막는 데 쓴다
  long countByCategoryId(Long categoryId);
}
