# 주문·결제 시스템

- 브랜치: `feat/order-payment`
- 의존 브랜치: `feat/cart`. 장바구니 PR을 먼저 develop에 병합한 뒤 이 PR을 병합한다.
- 페이지: `/orders/new`, `/orders/complete/{id}`
- 기존 `/checkout`은 새 주문 화면으로 이동한다.
- 기존 주문·결제 엔티티 및 관리자·마이페이지 API는 변경하지 않는다.

## API

### POST /api/v1/orders

`Idempotency-Key` 헤더에 요청별 UUID를 보낸다. 네트워크 오류로 결과를 모르면 같은 키와 같은 본문으로 재시도한다.

```json
{
  "pickupName": "모카손님",
  "pickupType": "takeout",
  "request": "얼음 적게",
  "payMethod": "card",
  "payDetail": "연습용 모의 결제",
  "cartVersion": "GET /api/v1/my/cart/items에서 받은 version"
}
```

성공은 201이며 주문번호·총액·주문 항목·모의 결제 승인 정보를 반환한다.
같은 키와 같은 요청은 기존 주문을 반환하고, 같은 키에 다른 요청은 409다.
키는 회원별로 분리하며 회원 행을 잠가 동시 재시도로 주문이 두 개 생성되는 것을 막는다.

모든 금액과 주문 항목은 서버 장바구니에서 읽는다.
클라이언트가 추가로 보낸 unitPrice, totalPrice, items는 결제 금액에 반영하지 않는다.
장바구니·수량·이름·가격·판매 상태가 화면을 본 이후 바뀌었으면 409로 재확인을 요구한다.
빈 장바구니, 판매 중지 상품, 0원 이하 또는 총 1,000만 원 초과 주문은 막는다.

주문 생성, 결제 기록 저장, 재시도 키 저장, 장바구니 비우기를 한 트랜잭션에서 실행한다.
중간 실패 시 모두 롤백되므로 결제되지 않았는데 바구니만 비워지는 상황을 막는다.
주문 항목에 이름·가격을 복사하므로 나중에 메뉴가 바뀌어도 영수증 금액은 유지된다.

### GET /api/v1/orders/{id}/receipt

본인 주문의 결제 영수증을 조회한다. 다른 회원 주문은 404다.
마이페이지 담당자의 `/api/v1/my/orders/{id}` 상세·취소 기능과 URL을 구분한다.

## WBS 및 팀 통합

제공된 WBS 이미지에는 주문 생성과 결제를 두 API로 나눴지만,
현재 저장소의 `docs/blueprints/12-orders.md`에서는 모의 결제를 단일 API·트랜잭션으로 합치도록 변경했다.
이번 구현은 저장소 청사진을 따르며 실제 PG 결제·환불·결제 전 주문 상태는 추가하지 않았다.
상태는 기존 관리자 흐름과 같은 paid → brewing → ready → done이다.

PR #19의 `CurrentMember` 세션 인증을 그대로 사용하도록 설계했다.
아직 인증 PR이 병합되지 않은 develop은 현재 회원이 1번으로 고정된 임시 구현이다.
실제 계정으로 배포하기 전에는 인증 PR 병합이 필요하다.

미병합 `feature/member-showcase-order-20261027`의 현장결제 주문 생성 및 checkout 화면과는 흐름이 다르다.
추후 해당 브랜치 병합 시 이 브랜치의 /checkout → /orders/new 이동을 유지하고,
클라이언트 가격으로 주문을 만드는 경로와 localStorage 장바구니 결제는 연결하지 않는다.
기존 마이페이지 코드 자체는 수정하지 않았다.

## 검증

- H2 전체 백엔드 테스트 및 프론트 프로덕션 빌드
- 금액 변조 입력 무시, 가격 변경 후 결제 거부, 빈/판매중지 바구니 거부
- 같은 키의 동시 결제·순차 재시도에서 주문/결제 각 한 개
- 결제 DB 저장 실패 시 주문·키 롤백 및 장바구니 보존
- 다른 회원 영수증·레시피 접근 차단
- 프론트 중복 제출 방지, 미확인 요청 재시도 키 보관, 오류 안내
- 실제 카드·계좌 정보는 수집하지 않는 모의 결제

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE="h2"
.\gradlew.bat test
.\gradlew.bat bootRun --args="--spring.profiles.active=h2"
# 다른 터미널
cd frontend
npm ci
npm run build
npm run dev
```

서버 운영 설정, 실제 PG, PostgreSQL 배포 환경 검증은 이 기능의 로컬 H2 검증과 별개다.
