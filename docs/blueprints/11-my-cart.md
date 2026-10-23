# 11.0 장바구니 (회원)

메뉴나 회원 포션을 담고, 수량을 바꾸고, 뺀다. 메뉴 조회·레시피 등록·포션 자랑에서도 "담기"로 이 API 를 쓴다.
**다른 시스템이 기대므로 일찍 만드는 게 좋다.**

- 엔티티: `CartItem` (메뉴 또는 포션 하나만, 가격은 저장 안 함), `Menu`, `Recipe`
- 지금 프론트: `frontend/app/cart/`, `lib/cart.ts` (브라우저 localStorage 목업) → 서버 API 로 바꾼다
- 시작 데이터: 모카손님 장바구니에 2개 (조각 케이크 ×2, 포션 ×1)

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 장바구니 목록 조회 | `/my/cart` | `GET /api/v1/my/cart/items` |
| 담기 (다른 화면에서) | `/menus/{slug}`, `/recipes/new` 등 | `POST /api/v1/my/cart/items` 본문 `{"menuId": 23, "quantity": 2}` 또는 `{"recipeId": 3}` |
| 수량 변경 | `/my/cart` | `PATCH /api/v1/my/cart/items/{id}` 본문 `{"quantity": 3}` |
| 빼기 | `/my/cart` | `DELETE /api/v1/my/cart/items/{id}` |

## 파일

```
controller/my/CartItemController.java    @RequestMapping("/api/v1/my/cart/items")
service/my/CartItemService.java, DfCartItemService.java
repository/CartItemRepository.java   (있음 — findAllByMemberId, 같은 상품 찾기 추가)
dto/my/cart/
  CartItemCreateRequestDto     menuId, recipeId, quantity (둘 중 하나만 → 아니면 400)
  CartItemQuantityRequestDto   quantity (@Min(1) @Max(99))
  CartItemListResponseDto      id, itemType(menu|recipe), name, options, imageUrl, unitPrice, quantity, lineTotal
  CartItemCreatedResponseDto / CartItemUpdatedResponseDto
```

## 규칙

- 같은 메뉴(또는 같은 포션)를 또 담으면 새 줄 대신 `cartItem.addQuantity(n)`
- 품절·숨김 메뉴는 담기 409
- 남의 장바구니 항목 수정·삭제는 404 (내 것만 찾는다: `findByIdAndMemberId`)
- 목록 응답에 합계(`totalPrice`)를 같이 줄지, 프론트에서 더할지 정하기. 줄 수가 적어 프론트 합계도 괜찮음
