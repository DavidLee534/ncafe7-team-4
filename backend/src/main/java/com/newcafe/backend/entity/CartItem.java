package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 회원 장바구니의 한 줄. 메뉴(menu)나 회원이 만든 포션(recipe) 중 하나를 담는다
// 가격은 저장하지 않고 담긴 메뉴·레시피에서 계산한다. 주문할 때 OrderItem 으로 값을 복사한다
@Entity
@Table(name = "cart_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  // 메뉴를 담으면 menu, 포션을 담으면 recipe. 둘 중 하나만 채운다
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "menu_id")
  private Menu menu;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "recipe_id")
  private Recipe recipe;

  @Column(nullable = false)
  private Integer quantity; // 수량 (1 이상)

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 담은 시각

  @Builder
  private CartItem(Member member, Menu menu, Recipe recipe, Integer quantity) {
    if ((menu == null) == (recipe == null)) {
      throw new IllegalArgumentException("장바구니에는 메뉴와 포션 중 하나만 담을 수 있습니다.");
    }
    this.member = member;
    this.menu = menu;
    this.recipe = recipe;
    this.quantity = quantity != null ? quantity : 1;
  }

  // 같은 상품을 또 담으면 수량만 늘린다
  public void addQuantity(int amount) {
    this.quantity += amount;
  }

  // 장바구니 화면의 수량 변경 (PATCH /my/cart/items/{id})
  public void changeQuantity(int quantity) {
    this.quantity = quantity;
  }

  // 한 개 가격. 메뉴면 메뉴 가격, 포션이면 포션 가격
  public int unitPrice() {
    return menu != null ? menu.getPrice() : recipe.getPrice();
  }

  @PrePersist
  private void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
}
