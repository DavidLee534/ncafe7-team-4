# 시스템 청사진

남은 시스템을 빠르게 만들기 위한 설계도입니다. 시스템마다 파일 한 장씩 있습니다.
**관리자 메뉴 관리(1.0)** 가 모델 시스템입니다. 새 시스템은 그 코드를 본떠서 만듭니다.

- 백엔드 모델: `controller/admin/MenuController`, `service/admin/MenuService`·`DfMenuService`, `repository/MenuRepository`, `dto/admin/menu/*`
- 프론트 모델: `frontend/app/admin/menus/`, `frontend/lib/adminApi.ts`

## 이미 깔아 둔 것 (feature/domain-entities)

| 무엇 | 위치 | 설명 |
|---|---|---|
| 엔티티 10개 | `entity/` | Member, SecretRecipe, SecretRecipeDiscovery, Recipe, CartItem, Order, OrderItem, Payment, PotionShowcase, ShowcaseRating |
| Menu 컬럼 추가 | `entity/Menu.java` | `slug`(사용자 메뉴 주소), `emotionTags`·`tasteTags`(감정 추천) |
| 리포지토리 | `repository/` | 엔티티마다 기본 `JpaRepository`. 조회 메서드는 만들 때 추가 |
| 현재 회원 | `common/auth/CurrentMember.java` | 인증 전까지 `currentMember.id()` 가 1을 돌려준다 |
| 시작 데이터 | `resources/data.sql` | H2 에서만 실행. 회원 4, 카테고리 8, 메뉴 30, 비밀 레시피 4, 포션 4, 장바구니 2, 주문 6, 게시글 2 |

### 엔티티 관계

```
Member ─┬─< Recipe >── Menu(baseMenu)          Recipe >── SecretRecipe (맞힌 경우)
        ├─< SecretRecipeDiscovery >── SecretRecipe >── Category
        ├─< CartItem >── Menu 또는 Recipe (둘 중 하나)
        ├─< Order ─< OrderItem (이름·가격 복사본)
        │        └── Payment (1:1)
        └─< PotionShowcase >── Recipe
                 └─< ShowcaseRating >── Member
```

### 상태 값 (모두 소문자 문자열, 요청 DTO 에서 `@Pattern` 으로 검증)

| 엔티티 | 필드 | 값 |
|---|---|---|
| Member | role | `member`, `admin` |
| Member | status | `active`, `suspended` |
| Order | status | `paid` → `brewing` → `ready` → `done`, `paid` 에서만 `cancelled` (규칙은 `Order.changeStatus`) |
| Order | pickupType | `dine-in`, `takeout` |
| Payment | method | `card`, `easy`, `transfer` |
| SecretRecipe | grade | `rare`, `legend` |
| Recipe | grade | `normal`, `rare`, `legend` |
| Menu | status | `on`, `soldout`, `hidden` |

## 재료 연결 (완료)

박준하 님 `feat/admin-ingredient`(Ingredient 엔티티)가 머지된 뒤 연금 공방을 재료 테이블로 옮겼습니다.

- 회원 포션 ↔ 재료: `RecipeIngredient` (`recipe_ingredients`). 기반 재료와 추가 재료를 한 줄씩 저장
- 비밀 레시피 ↔ 재료: 별도 테이블 대신 `SecretRecipe.baseIngredient` + `ingredientCombo`(기반 재료를 포함한 재료 id 를 작은 순으로 쉼표로 이은 값). 관리자 등록·수정에서 `baseIngredientId`, `ingredientIds` 로 정한다
- 재료 삭제 막기: 포션이나 비밀 레시피 조합에 쓰인 재료는 409
- `GET /api/v1/recipes/ingredients`: 계열마다 기반 재료와 열린 추가 재료 선반(개수 min~max, 티 블렌딩 묶음). 관리자 폼은 `GET /api/v1/admin/ingredients` 를 쓴다
- 테이블에 없는 규칙(메뉴 ↔ 기반 재료 · 기본 연금술 이름, 계열별 선반 · 제외 재료, 선반별 개수, 수식어 · 효과 칭호 이름 짓기, 색 섞기)은 `service/AlchemyRules.java`

## 모든 시스템 공통 규칙

- 컨트롤러는 도메인 이름, 역할은 패키지로: `controller/admin/OrderController`, `controller/my/OrderController`
- **같은 이름의 클래스가 두 패키지에 있으면 스프링 빈 이름이 겹쳐서 서버가 안 뜹니다.** 새로 만드는 쪽에 빈 이름을 붙이세요.
  `@RestController("myOrderController")`, `@Service("myOrderService")`, `@RestController("publicMenuController")` 처럼.
  (관리자 쪽은 이미 `menuController`, `dfMenuService` 같은 기본 이름을 쓰고 있음)
- 서비스는 인터페이스 + `Df` 구현체. 메서드 이름은 `getList`, `getDetail`, `create`, `update`, `delete`
- DTO 는 쓰임새마다 따로: `XxxListRequestDto`, `XxxCreateRequestDto`, `XxxUpdateRequestDto`, `XxxListResponseDto`, `XxxDetailResponseDto`, `XxxCreatedResponseDto`, `XxxUpdatedResponseDto`
- 등록 201, 삭제 204, 수정 PUT, 일부만 바꾸기(상태·순서) PATCH
- 요청 본문은 `@Valid` + 검증 어노테이션 → 실패하면 400 (`GlobalExceptionHandler` 가 처리)
- 없는 자원 404(`NotFoundException`), 지금 상태로 못 하는 요청 409(`IllegalStateException`)
- 남의 글 수정·삭제는 403 → `ForbiddenException` 이 아직 없음. 포션 자랑 게시판을 만드는 사람이 `common/exception` 에 추가
- 회원 기능(`/api/v1/my/...`)은 경로에 회원 id 를 넣지 않고 `CurrentMember` 로 받는다
  - 회원을 못 찾으면 `NotFoundException("회원을 찾을 수 없습니다: " + id)` → 404. PostgreSQL 에는 시작 데이터가 없어서 회원이 없으면 이 메시지로 원인을 바로 알 수 있다
  - PostgreSQL 로 테스트할 때는 회원 1명을 먼저 넣는다:
    `insert into members (email, password, nickname, role, status, created_at, updated_at) values ('moka@ncafe.dev', 'not-set', '모카손님', 'member', 'active', now(), now());`
    (공용 클라우드 DB 는 팀 확인 후)
- 검색은 목록 API + 쿼리 조건. 문자열 조건은 `cast(:keyword as String)` (PostgreSQL null 타입 문제, `MenuRepository` 참고)
- 목록 화면의 개수는 `summary` API 로

## 시스템 목록

| 번호 | 시스템 | 역할 | 청사진 | 상태 |
|---|---|---|---|---|
| 1.0 | 메뉴 관리 | 관리자 | — | 완료 (모델) |
| 2.0 | 카테고리 관리 | 관리자 | — | 완료 |
| 3.0 | 재료 관리 | 관리자 | — | PR 대기 (`feat/admin-ingredient`) |
| 4.0 | 비밀 레시피 관리 | 관리자 | [04-admin-secret-recipes.md](04-admin-secret-recipes.md) | |
| 5.0 | 주문 관리 | 관리자 | [05-admin-orders.md](05-admin-orders.md) | |
| 6.0 | 회원 관리 | 관리자 | [06-admin-members.md](06-admin-members.md) | |
| 7.0 | 관리자 메인 | 관리자 | [07-admin-main.md](07-admin-main.md) | |
| 8.0 | 메뉴 조회 | 익명 사용자 | [08-menus.md](08-menus.md) | |
| 9.0 | 레시피 등록 | 회원 | [09-recipes-new.md](09-recipes-new.md) | |
| 10.0 | 레시피 조회 (도감) | 회원 | [10-my-recipes.md](10-my-recipes.md) | |
| 11.0 | 장바구니 | 회원 | [11-my-cart.md](11-my-cart.md) | |
| 12.0 | 주문·결제 | 회원 | [12-orders.md](12-orders.md) | |
| 13.0 | 포션 자랑 게시판 | 회원 | [13-potion-showcases.md](13-potion-showcases.md) | |
| 14.0 | 마이페이지 | 회원 | [14-my-page.md](14-my-page.md) | |
| 15.0 | 메인 페이지 | 익명 사용자 | [15-home.md](15-home.md) | |
| 16.0 | 인증 | 회원 | [16-auth.md](16-auth.md) | |

## 나눠 맡기 (제안)

엔티티가 다 있으니 서로 기다리지 않고 만들 수 있습니다. 묶음 안에서는 위에서 아래 순서로.

| 묶음 | 시스템 | 이유 |
|---|---|---|
| A. 관리자 | 4 비밀 레시피 → 5 주문 관리 → 6 회원 관리 → 7 관리자 메인 | 비밀 레시피는 재료와 이어지므로 재료 담당이 이어 받으면 좋음 |
| B. 메뉴·레시피 | 8 메뉴 조회 → 9 레시피 등록 → 10 도감 | 연금 공방 화면을 만든 사람이 맡으면 좋음 |
| C. 장바구니·주문 | 11 장바구니 → 12 주문·결제 → 14 마이페이지 | 장바구니 API 는 B·D 도 쓰므로 C 가 먼저 열어 주면 좋음 |
| D. 게시판·마무리 | 13 포션 자랑 → 15 메인 → 16 인증 | 인증은 마지막. `CurrentMember` 한 곳만 바꾸면 됨 |

## WBS 와 다르게 정리한 곳

청사진은 아래처럼 고친 주소를 씁니다. WBS 도 같이 고쳐 주세요.

| 시스템 | WBS | 청사진 | 이유 |
|---|---|---|---|
| 5.0 | `PATCH /admin/orders` | `PATCH /admin/orders/{id}/status` | 어떤 주문인지 id 필요 |
| 6.0 | `PUT /admin/members/{id}/status` | `PATCH /admin/members/{id}/status` | 상태 하나만 바꾸므로 PATCH (주문 상태와 같게) |
| 6.0 | `GET /admin/members?keyword=` 별도 줄 | 목록 한 줄에 조건 | 검색은 목록 API + 조건 |
| 7.0 | `GET /api/v1/admin` | 데이터별 summary 와 목록 조건 | API 이름은 화면이 아니라 데이터 |
| 8.0 | `POST /api/v1/menus/{slug}` (장바구니 담기) | `POST /api/v1/my/cart/items` | 담기는 장바구니 시스템 API |
| 9.0 | 역할 "익명 사용자" | 회원 | 만든 포션을 회원 도감에 저장 |
| 9.0 | `POST /recipes/emotions` | `GET /recipes/emotions` | 감정 목록은 조회 |
| 9.0 | `GET /menus/recommendations?emotionId=&tasteIds=` | `GET /recipes/recommendations?emotion=&tastes=` | 레시피 화면의 곁다리. 태그가 문자열이라 id 대신 이름 |
| 9.0 | `GET /api/v1/menus` (기본 메뉴 고르기) | `GET /api/v1/recipes/menus` | 레시피 화면의 곁다리 |
| 12.0 | `GET /api/v1/cart/items` | `GET /api/v1/my/cart/items` | 장바구니는 my |
| 12.0 | `POST /orders` + `POST /orders/{id}/payments` | `POST /orders` 한 번 (결제 정보 포함) | 모의 결제라 나누면 "결제 전 주문" 상태가 필요해짐 |
| 13.0 | `PUT /potion-showcases/{id}/ratings` | `POST /potion-showcases/{id}/ratings` | 별점 주기 (이미 있으면 점수만 바꿈) |
| 14.0 | `GET /my/gallery-posts?size=3` | `GET /my/potion-showcases?size=3` | 게시판 이름과 맞춤 |
