# 12.0 주문 · 결제 (회원)

장바구니를 주문으로 만들고 모의 결제한다. 끝나면 장바구니를 비우고 주문 상세(`/my/orders/{id}`)로 보낸다.

- 엔티티: `Order`, `OrderItem`(이름·가격 복사본), `Payment`, `CartItem`
- 지금 프론트: `frontend/app/checkout/`, `lib/orders.ts` (목업) → 주소 `/orders/new`

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 주문 정보 입력 | `/orders/new` | `GET /api/v1/my/cart/items` (11.0) |
| 결제하기 | `/orders/new` | `POST /api/v1/orders` |

WBS 는 `POST /orders` 와 `POST /orders/{id}/payments` 두 번이었는데 **한 번으로 합쳤다.**
모의 결제라 나눌 이유가 적고, 나누면 "결제 전 주문" 상태가 하나 더 필요해진다. 실제 PG 를 붙일 때 나누면 된다.

## 파일

```
controller/OrderController.java    @RestController("orderCreateController") — 관리자·마이페이지 OrderController 와 겹침
service/OrderService.java, DfOrderService.java   (빈 이름 지정)
dto/order/
  OrderCreateRequestDto    pickupName, pickupType(dine-in|takeout), request, payMethod(card|easy|transfer), payDetail
  OrderCreatedResponseDto  id, orderNumber, status, totalPrice, approvalCode, paidAt
```

## 처리 순서 (한 트랜잭션, `@Transactional`)

1. `CurrentMember` 의 장바구니를 읽는다. 비어 있으면 409
2. 품절·숨김 메뉴가 있으면 409
3. `Order` 를 만들고 장바구니 줄마다 `OrderItem` 을 복사해 `order.addItem(...)` (이름, 재료, 지금 가격, 수량)
4. 주문번호 `NC + yyMMdd + - + 4자리` 생성 (중복이면 다시)
5. `Payment` 저장 (금액 = `order.getTotalPrice()`, 모의 승인번호)
6. 장바구니 비우기
7. 201 + 주문 id → 프론트가 `/my/orders/{id}` 로 이동
