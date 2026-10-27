package com.newcafe.backend.repository;

import com.newcafe.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByMemberIdOrderByCreatedAtDesc(Long memberId);
  Optional<Order> findByIdAndMemberId(Long id, Long memberId);
}
