package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Menu;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MenuRepository extends JpaRepository<Menu, Long> {

  // 메뉴 목록을 카테고리와 함께 한 번에 가져온다.
  // 이게 없으면 메뉴마다 카테고리 이름을 꺼낼 때 카테고리 조회가 따로 나간다 (N+1)
  @Override
  @EntityGraph(attributePaths = "category")
  List<Menu> findAll();

  // 검색 조건으로 거른 메뉴 목록. 값이 null인 조건은 건너뛴다
  // 카테고리는 fetch join으로 함께 가져온다 (N+1 방지)
  // 정렬과 개수 제한은 pageable로 받는다 (예: 최근 수정순 5개)
  // keyword는 cast(... as String)으로 문자열임을 알려 준다. PostgreSQL은 null 파라미터의 타입을
  // 모르면 bytea로 보고 lower(bytea) 오류를 낸다 (H2는 그냥 넘어가서 H2 테스트로는 안 드러난다)
  // status가 비어 있는 예전 메뉴는 응답 DTO처럼 "on"(판매중)으로 본다
  @Query("""
      select m from Menu m left join fetch m.category c
      where (:categoryId is null or c.id = :categoryId)
        and (:status is null or coalesce(m.status, 'on') = :status)
        and (:ownerRecommended is null or m.ownerRecommended = :ownerRecommended)
        and (cast(:keyword as String) is null
             or lower(m.korName) like lower(concat('%', cast(:keyword as String), '%'))
             or lower(m.engName) like lower(concat('%', cast(:keyword as String), '%')))
      """)
  List<Menu> findAllByCondition(
      @Param("categoryId") Long categoryId,
      @Param("status") String status,
      @Param("ownerRecommended") Boolean ownerRecommended,
      @Param("keyword") String keyword,
      Pageable pageable);

  // 등록할 때 같은 slug가 있는지 확인
  boolean existsBySlug(String slug);

  // 수정할 때 자기 자신을 뺀 다른 메뉴에 같은 slug가 있는지 확인
  boolean existsBySlugAndIdNot(String slug, Long id);

  // 카테고리에 속한 메뉴 수. 메뉴가 있는 카테고리는 삭제를 막는 데 쓴다
  long countByCategoryId(Long categoryId);

  // 상태(on, soldout, hidden)별 메뉴 수. 메뉴 목록 상단의 개수에 쓴다
  // status가 비어 있는 예전 메뉴는 "on"으로 센다 (목록 검색·응답 DTO와 같은 기준)
  @Query("select count(m) from Menu m where coalesce(m.status, 'on') = :status")
  long countByStatus(@Param("status") String status);

  // 카테고리 안의 상태별 메뉴 수. 카테고리를 골랐을 때의 개수에 쓴다
  @Query("select count(m) from Menu m where m.category.id = :categoryId and coalesce(m.status, 'on') = :status")
  long countByCategoryIdAndStatus(@Param("categoryId") Long categoryId, @Param("status") String status);
}
