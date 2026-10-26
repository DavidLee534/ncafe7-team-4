# 14.0 마이페이지 (회원)

회원 자신의 계정, 멤버십, 주문 내역, 내 글. 모든 API 가 `/api/v1/my/...` 이고 회원은 `CurrentMember` 로 받는다.

- 엔티티: `Member`, `Order`, `OrderItem`, `Payment`, `PotionShowcase`
- 지금 프론트: `frontend/app/mypage/` (목업) → 주소 `/my`
- 시작 데이터: 모카손님 주문 4개 (done 2, cancelled 1, paid 1), 게시글 1개

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 마이페이지 | `/my` | `GET /api/v1/my/account` |
| | | `GET /api/v1/my/membership` |
| | | `GET /api/v1/my/orders?size=3` |
| | | `GET /api/v1/my/orders/summary` |
| | | `GET /api/v1/my/potion-showcases?size=3` |
| 회원 정보 수정 | `/my/account` | `GET /api/v1/my/account`, `PUT /api/v1/my/account` |
| 회원 탈퇴 | `/my/account` | `DELETE /api/v1/my/account` |
| 주문 조회 | `/my/orders` | `GET /api/v1/my/orders?status=&size=` |
| 주문 상세 | `/my/orders/{id}` | `GET /api/v1/my/orders/{id}` |
| 주문 취소 | `/my/orders/{id}` | `PATCH /api/v1/my/orders/{id}/status` 본문 `{"status": "cancelled"}` |
| 내 글 조회 | `/my/potion-showcases` | `GET /api/v1/my/potion-showcases` |

## 파일

```
controller/my/AccountController.java         (account, membership)
controller/my/OrderController.java           @RestController("myOrderController")
controller/my/PotionShowcaseController.java  @RestController("myPotionShowcaseController")
service/my/... (같은 방식, 빈 이름 지정)
dto/my/account/
  AccountResponseDto            email, nickname, createdAt   (password 절대 X)
  AccountUpdateRequestDto       nickname (필수 20자)
  MembershipResponseDto         level(0|1|2), name, orderCount, nextLevelAt
dto/my/order/
  MyOrderListRequestDto         status, size
  MyOrderListResponseDto        id, orderNumber, status, itemSummary("딸기 라떼 외 1건"), totalPrice, createdAt
  MyOrderDetailResponseDto      목록 + pickupName, pickupType, request, items[], payment{}
  MyOrderSummaryResponseDto     all, inProgress(paid+brewing+ready), done, cancelled
  MyOrderStatusRequestDto       status (@Pattern "cancelled" — 회원은 취소만)
dto/my/showcase/
  MyPotionShowcaseListResponseDto id, title, recipeName, averageScore, createdAt
```

## 규칙

- 멤버십: 취소를 뺀 주문 수로 계산. 0~4회 0단계, 5~19회 1단계, 20회 이상 2단계 (목업 `MembershipStatus.tsx` 와 같게, 이름도 거기서)
- 주문 상세·취소는 내 주문만 (`findByIdAndMemberId`, 아니면 404)
- 취소는 `order.cancel()` → `paid` 가 아니면 409 (제조가 시작된 주문)
- 탈퇴: 주문·포션·게시글이 회원을 참조해서 바로 지우면 외래키 오류. 6.0 회원 관리와 같이 `withdrawn` 상태로 처리하는 걸 권장 (팀 확인)
