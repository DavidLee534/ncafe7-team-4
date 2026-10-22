package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Ingredient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

  // 검색 조건으로 거른 재료 목록. 값이 null인 조건은 건너뛴다
  // 기반 재료 먼저, 같은 종류 안에서는 계열·선반 이름순, 그 안에서는 등록순
  // keyword · shelf는 cast(... as String)으로 문자열임을 알려 준다 (MenuRepository.findAllByCondition 참고)
  @Query("""
      select i from Ingredient i
      where (cast(:type as String) is null or i.type = :type)
        and (cast(:shelf as String) is null or i.shelf = :shelf)
        and (cast(:keyword as String) is null
             or lower(i.name) like lower(concat('%', cast(:keyword as String), '%'))
             or lower(i.modifier) like lower(concat('%', cast(:keyword as String), '%')))
      order by i.type asc, i.shelf asc, i.id asc
      """)
  List<Ingredient> findAllByCondition(
      @Param("type") String type,
      @Param("shelf") String shelf,
      @Param("keyword") String keyword);

  // 등록할 때 같은 이름이 있는지 확인
  boolean existsByName(String name);

  // 수정할 때 자기 자신을 뺀 다른 재료에 같은 이름이 있는지 확인
  boolean existsByNameAndIdNot(String name, Long id);
}
