package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Order;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface OrderRepository extends JpaRepository<Order, Long> {

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
}
