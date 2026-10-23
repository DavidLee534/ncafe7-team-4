# 5.0 주문 관리 (관리자)

들어온 주문을 보고 제조 상태를 한 단계씩 넘긴다 (paid → brewing → ready → done).

- 엔티티: `Order`, `OrderItem`, `Payment`, `Member`
- 시작 데이터에 상태가 골고루 섞인 주문 6개가 있음

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 목록 조회 | `/admin/orders` | `GET /api/v1/admin/orders?status=&keyword=&sort=&size=` (keyword: 주문번호·픽업 이름) |
| | | `GET /api/v1/admin/orders/summary` (상태별 개수, 오늘 매출) |
| 제조 상태 변경 | `/admin/orders` | `PATCH /api/v1/admin/orders/{id}/status` 본문 `{"status": "brewing"}` |
| 상세 조회 | `/admin/orders/{id}` | `GET /api/v1/admin/orders/{id}` |

## 파일

```
controller/admin/OrderController.java
service/admin/OrderService.java, DfOrderService.java
repository/OrderRepository.java   (있음 — 검색 쿼리, 상태별 count 추가)
dto/admin/order/
  OrderListRequestDto        status, keyword, sort, size
  OrderStatusRequestDto      status (@Pattern "brewing|ready|done|cancelled")
  OrderListResponseDto       id, orderNumber, status, pickupName, pickupType, itemCount, totalPrice, createdAt
  OrderDetailResponseDto     목록 + memberNickname, request, items[{name, options, unitPrice, quantity}], payment{method, detail, approvalCode, paidAt}
  OrderStatusResponseDto     id, status, updatedAt
  OrderSummaryResponseDto    all, paid, brewing, ready, done, cancelled, todaySales
```

## 주의

- 상태 규칙은 엔티티에 이미 있음: `order.changeStatus(next)` → 잘못된 순서면 `IllegalStateException` → 409
- 목록에서 항목 수를 셀 때 `items` 를 지연 로딩하면 N+1 → `left join fetch o.items` 또는 count 쿼리
- 상세는 `items` 와 `Payment` 를 함께. `PaymentRepository.findByOrderId` 추가
