package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Ingredient;
import java.util.List;
import java.util.Optional;
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

  // 종류(base, extra)별 재료 수. 관리자 메인의 재료 현황에 쓴다
  long countByType(String type);

  // 손님 화면에서 숨긴 재료 수 (재고 없음 등)
  long countByVisibleFalse();

  // 연금 공방: 메뉴의 기반 재료를 이름으로 찾는다 (메뉴 ↔ 기반 재료는 AlchemyRules 의 이름 매핑)
  Optional<Ingredient> findByName(String name);

  // 연금 공방의 재료 선반: 손님에게 보이는 재료 전체 (등록순)
  List<Ingredient> findAllByVisibleTrueOrderByIdAsc();
}
