package com.newcafe.backend.repository;

import com.newcafe.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

// 조회 메서드는 이 엔티티를 쓰는 시스템을 만들 때 필요한 것만 추가한다
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  // 관리자가 메뉴를 지울 때, 그 메뉴가 담긴 장바구니 줄도 함께 지운다
  void deleteAllByMenuId(Long menuId);
}
