# 장바구니 시스템

- 브랜치: `feat/cart` (기준: `develop`)
- 페이지: `/my/cart`; 기존 `/cart`는 이동 처리
- 기존 공통 엔티티·Repository·인증·관리자·마이페이지 파일은 변경하지 않음
- 인증은 `CurrentMember.id()`를 사용. develop은 1번 회원 임시 구현이며 실제 세션 인증은 PR #19 병합이 필요함

## API

| Method | URL | 요청 / 응답 |
|---|---|---|
| GET | /api/v1/my/cart/items | {items, totalPrice, totalQuantity, version} |
| POST | /api/v1/my/cart/items | {menuId, quantity?} 또는 {recipeId, quantity?}; 201 |
| PATCH | /api/v1/my/cart/items/{id} | {quantity}; 200 |
| DELETE | /api/v1/my/cart/items/{id} | 204 |
| DELETE | /api/v1/my/cart/items | 전체 비우기; 204 |
| GET | /api/v1/my/cart/catalog | 판매 중인 메뉴와 내 레시피 선택 목록 |

수량 1~20(생략하면 1), 소수 수량 400, 상품 최대 100종. 동일 상품은 기존 줄에 수량을 더함.
품절·숨김 메뉴와 숨김 카테고리는 담기 409, 남의 항목은 404, 정지 회원은 403.
레시피는 본인 소유만 담을 수 있으며 기반 메뉴의 판매 상태도 확인함.
가격·상품명은 DB에서 조회하고, 클라이언트가 보낸 가격을 사용하지 않음.

회원 행의 DB 쓰기 잠금으로 같은 회원의 담기·변경·삭제 요청을 직렬화함.
주문·결제 기능도 같은 잠금을 사용하도록 다음 브랜치에서 연결함.

## 화면과 다른 담당자 연동

헤더의 기존 `useCart()` API를 유지하면서 브라우저 저장소 대신 서버를 조회함.
기존 메뉴 담기 호출은 서버 상품 목록에서 정확히 일치하는 한 상품만 찾아 연결함.
신규 메뉴·레시피 화면에서는 `addServerCartItem({menuId})` 또는 `addServerCartItem({recipeId})`를 사용해야 함.
목업 메뉴의 배열 순번을 실제 DB id로 보내지 않음.
저장되지 않은 공방 목업 레시피는 서버 상품으로 확정할 수 없어 저장을 안내함.
기존 localStorage 장바구니는 가격·식별자를 신뢰할 수 없어 자동으로 가져오지 않음.

`feature/member-showcase-order-20261027`은 develop에 미병합이고 PR도 없는 상태로 확인됨.
이 브랜치에는 동일 URL의 담기 API가 있으므로 추후 통합 시 두 컨트롤러를 동시에 등록하면 안 됨.
이 구현의 CartCheckoutController를 유지하고 해당 브랜치의 중복 담기 컨트롤러는 제외해야 함.
팀 브랜치를 임의로 병합·수정하지 않았음.

## 로컬 검증

```powershell
cd backend
.\gradlew.bat test --tests "*CartIntegrationTest"
.\gradlew.bat bootRun --args="--spring.profiles.active=h2"
# 다른 터미널
cd frontend
npm ci
npm run build
npm run dev
```

h2 프로필은 메모리 DB로 시작 데이터를 넣으며 종료하면 데이터가 사라짐.
PostgreSQL은 기존 secret.properties 설정을 그대로 사용함.
주문·결제 연결은 `feat/order-payment`에서 별도로 진행함.
