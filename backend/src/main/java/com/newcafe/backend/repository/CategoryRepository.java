package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

  // 화면에 나오는 순서대로. 순서가 같으면 먼저 만든 것(id)부터
  List<Category> findAllByOrderBySortOrderAscIdAsc();

  // 등록할 때 같은 이름이 있는지 확인
  boolean existsByName(String name);

  // 수정할 때 자기 자신을 뺀 다른 카테고리에 같은 이름이 있는지 확인
  boolean existsByNameAndIdNot(String name, Long id);

  // 새 카테고리의 기본 순서(맨 뒤)를 정할 때. 하나도 없으면 0
  @Query("select coalesce(max(c.sortOrder), 0) from Category c")
  int findMaxSortOrder();
}
