package com.newcafe.backend.repository;

import com.newcafe.backend.entity.SecretRecipe;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface SecretRecipeRepository extends JpaRepository<SecretRecipe, Long> {

  // 이 카테고리(계열)에 속한 비밀 레시피가 있는지. 있으면 관리자가 카테고리를 지울 수 없다
  boolean existsByCategoryId(Long categoryId);

  // 관리자 비밀 레시피 목록. 값이 null인 조건은 건너뛴다
  // 계열(카테고리)은 fetch join으로 함께 가져온다 (N+1 방지)
  // keyword는 cast(... as String)으로 문자열임을 알려 준다 (PostgreSQL의 null 파라미터 bytea 오류 방지, MenuRepository와 같은 이유)
  @Query("""
      select s from SecretRecipe s left join fetch s.category c
      where (:grade is null or s.grade = :grade)
        and (:categoryId is null or c.id = :categoryId)
        and (cast(:keyword as String) is null
             or lower(s.name) like lower(concat('%', cast(:keyword as String), '%')))
      order by s.id
      """)
  List<SecretRecipe> findAllByCondition(
      @Param("grade") String grade,
      @Param("categoryId") Long categoryId,
      @Param("keyword") String keyword);

  // 등록할 때 같은 이름이 있는지 확인
  boolean existsByName(String name);

  // 수정할 때 자기 자신을 뺀 다른 레시피에 같은 이름이 있는지 확인
  boolean existsByNameAndIdNot(String name, Long id);

  // 등급(rare, legend)별 개수. 목록 상단 요약에 쓴다
  long countByGrade(String grade);

  // 회원 도감: 손님에게 보이는(visible) 비밀 레시피 전체. 계열은 fetch join (N+1 방지)
  @Query("select s from SecretRecipe s left join fetch s.category where s.visible = true order by s.id")
  List<SecretRecipe> findAllVisibleWithCategory();

  // 손님에게 보이는 비밀 레시피 수 (도감 요약의 분모)
  long countByVisibleTrue();
}
