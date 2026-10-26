package com.newcafe.backend.repository;

import com.newcafe.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
