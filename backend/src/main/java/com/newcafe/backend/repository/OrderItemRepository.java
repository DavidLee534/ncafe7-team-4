package com.newcafe.backend.repository;

import com.newcafe.backend.entity.OrderItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

  // 주문별 잔 수(수량 합계). 주문 목록에서 주문마다 항목을 따로 불러오지 않도록 한 번에 센다 (N+1 방지)
  @Query("""
      select oi.order.id as orderId, sum(oi.quantity) as quantity
      from OrderItem oi
      where oi.order.id in :orderIds
      group by oi.order.id
      """)
  List<OrderQuantity> sumQuantityByOrderIds(@Param("orderIds") List<Long> orderIds);

  // sumQuantityByOrderIds 결과의 한 줄
  interface OrderQuantity {
    Long getOrderId();
    Long getQuantity();
  }
}
