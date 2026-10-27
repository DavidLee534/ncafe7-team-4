package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Order;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByMemberIdOrderByCreatedAtDesc(Long memberId);
  Optional<Order> findByIdAndMemberId(Long id, Long memberId);

  // 상태(paid, brewing, ready, done, cancelled)별 주문 수. 관리자 메인의 주문 현황에 쓴다
  long countByStatus(String status);

  // from 이후(오늘 0시부터)의 주문 수. 취소한 주문은 빼고 센다
  @Query("select count(o) from Order o where o.createdAt >= :from and o.status <> 'cancelled'")
  long countSince(@Param("from") LocalDateTime from);

  // from 이후의 매출 합계. 취소한 주문은 빼고, 주문이 없으면 0
  @Query("select coalesce(sum(o.totalPrice), 0) from Order o where o.createdAt >= :from and o.status <> 'cancelled'")
  long sumTotalPriceSince(@Param("from") LocalDateTime from);

  // 처리할 주문. 오래 기다린 주문부터 5개 (관리자 메인)
  List<Order> findTop5ByStatusOrderByCreatedAtAsc(String status);

  // 검색 조건으로 거른 주문 목록. 값이 null인 조건은 건너뛴다
  // keyword는 주문번호와 픽업 이름에서 대소문자 없이 찾는다
  // keyword는 cast(... as String)으로 문자열임을 알려 준다 (PostgreSQL null 파라미터 문제, MenuRepository 참고)
  // 정렬과 개수 제한은 pageable로 받는다
  @Query("""
      select o from Order o
      where (:status is null or o.status = :status)
        and (cast(:keyword as String) is null
             or lower(o.orderNumber) like lower(concat('%', cast(:keyword as String), '%'))
             or lower(o.pickupName) like lower(concat('%', cast(:keyword as String), '%')))
      """)
  List<Order> findAllByCondition(
      @Param("status") String status,
      @Param("keyword") String keyword,
      Pageable pageable);

  // 주문 상세. 주문한 회원과 주문 항목을 한 번에 가져온다 (N+1 방지)
  @Query("""
      select distinct o from Order o
      join fetch o.member
      left join fetch o.items
      where o.id = :id
      """)
  Optional<Order> findDetailById(@Param("id") Long id);

  // 상태(paid, brewing, ready, done, cancelled)별 주문 수. 주문 목록 상단의 개수에 쓴다
  // from 이후에 들어온 주문의 매출 합계. 취소된 주문은 뺀다. 주문이 없으면 0
  @Query("""
      select coalesce(sum(o.totalPrice), 0) from Order o
      where o.createdAt >= :from and o.status <> 'cancelled'
      """)
  long sumSalesSince(@Param("from") LocalDateTime from);

  // 회원의 주문 수 (관리자 회원 상세). 주문이 있는 회원은 삭제를 막는 데도 쓴다
  long countByMemberId(Long memberId);
}
