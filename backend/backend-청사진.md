# ncafe backend 청사진

[backend-지시서.txt](backend-지시서.txt)를 구현 가능한 설계로 풀어쓴 문서. 이 문서대로 `backend/` 프로젝트를 새로 만든다.

## 1. 프로젝트 기본 설정

| 항목 | 값 |
|---|---|
| 프로젝트명 | `backend` (`settings.gradle`의 `rootProject.name`) |
| 빌드 도구 | Gradle (Gradle Wrapper 포함, Groovy DSL) |
| JDK | 21 (`java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }`) |
| Spring Boot | **4.1.1** (2026-10-06 기준 start.spring.io 최신 안정 버전, JDK 21 지원). Gradle Wrapper 9.7.1 |
| 서버 포트 | 8080 (프론트엔드가 `http://localhost:8080`을 호출) |

### 패키지명 확인 필요

지시서의 `com.new-cafe.backend`는 하이픈(`-`) 때문에 **Java 패키지명으로 쓸 수 없다.** 아래 중 하나로 정해야 한다.

| 후보 | 비고 |
|---|---|
| `com.newcafe.backend` | 지시서와 가장 가까움. **이 문서의 기본값** |
| `com.new_cafe.backend` | 하이픈 대신 밑줄 |
| `com.newlecture.ncafe.backend` | 이전 프로젝트에서 쓰던 이름 |

이후 문서의 `{base}`는 확정한 패키지를 뜻한다.

### 의존성 (최소)

| 추가 | `org.springframework.boot:spring-boot-starter-webmvc` (REST API, 내장 Tomcat, Jackson 포함). Spring Boot 4부터 기존 `starter-web`의 이름이 바뀐 것 |
|---|---|
| 추가 (단계 3) | `spring-boot-starter-data-jpa`, `org.postgresql:postgresql`(runtimeOnly) |
| 테스트 | `spring-boot-starter-webmvc-test` (프로젝트 생성 시 기본 포함되는 것만) |
| 추가 금지 | Lombok, Security, Validation, DevTools 등 위 외 전부 |

지시서는 JPA를 금지했으나, **2026-10-06 사용자 결정으로 JPA + PostgreSQL을 사용**한다. 그 외에는 지시서대로 최소 라이브러리만 넣고, 필요해지면 그때 사용자에게 확인한다.

## 2. 아키텍처: 3계층

```
요청 → Controller → Service → Repository → 저장소
        (HTTP)      (업무 규칙)   (데이터 접근)
```

| 계층 | 책임 | 하지 않는 것 |
|---|---|---|
| Controller | 요청 매핑, 요청/응답 DTO 변환, HTTP 상태코드 | 업무 규칙, 데이터 접근 |
| Service | 업무 규칙, 트랜잭션 성격의 흐름 조합 | HTTP 세부사항(`ResponseEntity` 등) |
| Repository | 데이터 저장/조회 | 업무 규칙 |

규칙

- 의존 방향은 위에서 아래로만 (Controller → Service → Repository). 역방향 금지.
- 계층 간에는 **인터페이스**로 참조한다. Service는 인터페이스 + `Df` 구현체, Repository는 `JpaRepository`를 상속한 인터페이스만 만든다 (구현체는 Spring Data JPA가 생성).
- 생성자 주입만 사용한다 (`@Autowired` 필드 주입 금지).
- DTO는 **`record`**로 작성한다. 엔티티는 JPA 규칙상 record를 쓸 수 없으므로 일반 클래스(`protected` 기본 생성자 + getter, Lombok 없이 직접 작성)로 만든다.
- 엔티티를 컨트롤러 응답으로 직접 내보내지 않는다. 항상 Service에서 DTO로 바꿔 반환한다.
- 데이터를 바꾸는 Service 메서드에는 `@Transactional`, 조회 전용에는 `@Transactional(readOnly = true)`를 붙인다.

## 3. 패키지 구조

역할별 폴더는 프론트엔드 라우트와 같은 기준으로 나눈다.

| 폴더 | 역할 | 프론트엔드 | API 경로 |
|---|---|---|---|
| `anon` | 비로그인 사용자 | `app/(anon)` | `/api/v1/menus`, `/api/v1/landing` |
| `member` | 회원 | `app/my` | `/api/v1/my/**` |
| `admin` | 관리자 | `app/admin` | `/api/v1/admin/**` |

`controller`, `service`, `dto`는 이 세 폴더로 나눈다. `repository`와 `entity`는 같은 데이터를 여러 역할이 함께 쓰므로 역할별로 나누지 않고 도메인 기준으로 둔다. 예외 처리, 설정처럼 특정 계층에 속하지 않는 코드는 `common` 아래에 둔다.

```
backend/
├── build.gradle
├── settings.gradle
├── gradlew, gradlew.bat, gradle/wrapper/
├── src/main/resources/
│   ├── application.properties                      # DB 연결, JPA 설정 (단계 3)
│   └── data.sql                                    # 샘플 카테고리·메뉴 (단계 4)
└── src/main/java/{base}/
    ├── BackendApplication.java
    ├── controller/
    │   ├── anon/
    │   │   ├── MenuController.java                 # /api/v1/menus
    │   │   └── LandingController.java              # /api/v1/landing
    │   ├── member/
    │   │   ├── CartController.java                 # /api/v1/my/basket
    │   │   ├── OrderController.java                # /api/v1/my/orders
    │   │   └── MemberDashboardController.java      # /api/v1/my/dashboard
    │   └── admin/
    │       ├── AdminMenuController.java            # /api/v1/admin/menus
    │       └── AdminDashboardController.java       # /api/v1/admin/dashboard
    ├── service/                                    # 인터페이스 + Df 구현체 (구현체는 Df 접두사)
    │   ├── anon/
    │   │   ├── MenuService.java                    # getList(req), getDetail(id)
    │   │   ├── DfMenuService.java
    │   │   ├── CategoryService.java                # getList()
    │   │   ├── DfCategoryService.java
    │   │   ├── LandingService.java                 # get()
    │   │   └── DfLandingService.java
    │   ├── member/
    │   │   ├── CartService.java                    # get, add, updateQuantity, remove (memberId 포함)
    │   │   ├── DfCartService.java
    │   │   ├── OrderService.java                   # create, getList(months), getDetail, cancel
    │   │   ├── DfOrderService.java
    │   │   ├── MemberDashboardService.java         # get(memberId)
    │   │   └── DfMemberDashboardService.java
    │   └── admin/
    │       ├── AdminMenuService.java               # getList, getDetail, create, update, delete
    │       ├── DfAdminMenuService.java
    │       ├── AdminDashboardService.java          # get()
    │       └── DfAdminDashboardService.java
    ├── repository/                                 # JpaRepository 상속 인터페이스만 (구현체 없음). 역할 구분 없음
    │   ├── MenuRepository.java                     # JpaRepository<Menu, Long> + findByVisibleTrue 등
    │   ├── CategoryRepository.java                 # JpaRepository<Category, Long>
    │   ├── CartItemRepository.java                 # + findByMemberId, findByMemberIdAndMenuId, deleteByMemberId
    │   └── OrderRepository.java                    # + findByMemberIdOrderByOrderedAtDesc
    ├── entity/                                     # @Entity 클래스 (record 불가). 역할 구분 없음
    │   ├── Category.java                           # id, name
    │   ├── Menu.java                               # id, name, description, price, categoryId, visible, createdAt
    │   ├── CartItem.java                           # id, memberId, menuId, quantity
    │   ├── Order.java                              # id, memberId, items, totalPrice, status, orderedAt (@Table "orders": order는 SQL 예약어)
    │   ├── OrderItem.java                          # menuId, menuName, unitPrice, quantity (주문 시점 값 보관, Order와 1:N)
    │   └── OrderStatus.java                        # enum: PLACED, PREPARING, DONE, CANCELED (@Enumerated STRING)
    ├── common/                                     # 여러 계층·역할이 함께 쓰는 공통 코드만 둔다
    │   ├── exception/
    │   │   ├── NotFoundException.java              # 404
    │   │   └── GlobalExceptionHandler.java         # @RestControllerAdvice. NotFound→404, IllegalState→409
    │   └── config/
    │       └── WebConfig.java                      # CORS 허용 (단계 9)
    └── dto/                                        # record
        ├── anon/
        │   ├── menu/
        │   │   ├── MenuListRequestDto.java         # category, sort, page (쿼리 파라미터)
        │   │   ├── MenuListResponseDto.java        # id, name, price, category
        │   │   ├── MenuDetailResponseDto.java      # id, name, description, price, category
        │   │   └── CategoryListResponseDto.java    # id, name, count
        │   └── landing/
        │       └── LandingResponseDto.java         # featuredMenus, categories
        ├── member/
        │   ├── cart/
        │   │   ├── CartItemAddRequestDto.java      # menuId, quantity
        │   │   ├── CartItemUpdateRequestDto.java   # quantity
        │   │   ├── CartItemResponseDto.java        # id, menuId, menuName, unitPrice, quantity
        │   │   └── CartResponseDto.java            # items, totalPrice
        │   ├── order/
        │   │   ├── OrderItemResponseDto.java       # menuId, menuName, unitPrice, quantity
        │   │   └── OrderResponseDto.java           # id, status, totalPrice, orderedAt, items
        │   └── dashboard/
        │       └── MemberDashboardResponseDto.java # cartItemCount, recentOrders
        └── admin/
            ├── menu/
            │   ├── MenuCreateRequestDto.java       # name, description, price, categoryId, visible
            │   ├── MenuUpdateRequestDto.java       # 위와 동일
            │   └── AdminMenuResponseDto.java       # 전체 필드 + createdAt
            └── dashboard/
                └── AdminDashboardResponseDto.java  # menuCount, todayOrderCount, todaySales
```

### 구현체 최소 동작

| 구현체 | 최소 동작 |
|---|---|
| Repository 전체 | `JpaRepository` 상속, 필요한 조회는 메서드 이름 규칙(`findByMemberId` 등)으로 선언. 샘플 데이터는 `data.sql`로 적재 |
| `DfMenuService` | `visible`인 메뉴만 조회, `category` 필터와 `sort`(price/기본 id순) 적용, 카테고리명은 `CategoryRepository`로 채움 |
| `DfCategoryService` | 카테고리별 공개 메뉴 수(`count`) 계산 |
| `DfAdminMenuService` | 비공개 포함 전체 조회, 등록/수정/삭제. 없으면 `NotFoundException` |
| `DfCartService` | 같은 메뉴를 담으면 수량 합산, 본인 항목만 수정/삭제 가능 |
| `DfOrderService` | 장바구니로 주문 생성(메뉴명·가격을 주문 시점 값으로 복사) 후 장바구니 비움. 빈 장바구니는 `IllegalStateException`, 취소는 `PLACED` 상태만 가능 |
| `DfLandingService` | `MenuService`/`CategoryService`를 호출해 추천 메뉴 4개와 카테고리 조합 |
| `Df*DashboardService` | 회원: 장바구니 수 + 최근 주문 3건. 관리자: 메뉴 수 + 오늘 주문 수(취소 제외) + 오늘 매출 |

**빈 이름 충돌 방지**: Spring의 기본 빈 이름은 패키지가 아니라 **클래스명**으로 정해진다. 역할별 폴더로 나눠도 `anon/MenuController`와 `admin/MenuController`처럼 클래스명이 같으면 `menuController`로 충돌해 앱이 시작되지 않는다. 그래서 역할이 겹치는 도메인은 `AdminMenuController`, `AdminMenuService`처럼 역할명을 클래스명에 접두사로 붙인다. (DTO는 빈이 아니어서 충돌하지 않지만, import 혼동을 피하려고 같은 방식을 따른다.)

## 4. 기능과 API 설계

공통 규칙: 모든 경로는 `/api/v1` 아래, JSON 응답, 조회는 `GET`, 생성 `POST`(201), 수정 `PUT`(200), 삭제 `DELETE`(204), 없는 자원은 404.

### 4.1 사용자: 메뉴 조회 (비로그인 가능)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/v1/menus` | 공개 메뉴 목록. 쿼리: `category`, `price`, `sort`, `page`. 응답은 배열 |
| GET | `/api/v1/menus/{id}` | 메뉴 상세 |
| GET | `/api/v1/menus/categories` | 카테고리 목록 (공개 메뉴 수 포함) |

프론트엔드가 이미 `/api/v1/menus`, `/api/v1/menus/categories`를 호출하므로 이 두 경로는 **변경하지 않는다.**

### 4.2 관리자: 메뉴 관리

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/v1/admin/menus` | 전체 목록 (비공개 포함) |
| GET | `/api/v1/admin/menus/{id}` | 상세 |
| POST | `/api/v1/admin/menus` | 등록 |
| PUT | `/api/v1/admin/menus/{id}` | 수정 (`id`는 경로에서 받는다) |
| DELETE | `/api/v1/admin/menus/{id}` | 삭제 |

- 조회 `GET`에는 `@RequestBody`를 쓰지 않는다. 필터는 쿼리 파라미터로 받는다 (body 없이 요청하면 400이 나는 문제 방지).

### 4.3 회원: 장바구니

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/v1/my/basket` | 내 장바구니 조회 |
| POST | `/api/v1/my/basket/items` | 메뉴 담기 (`menuId`, `quantity`) |
| PUT | `/api/v1/my/basket/items/{itemId}` | 수량 변경 |
| DELETE | `/api/v1/my/basket/items/{itemId}` | 항목 삭제 |

### 4.4 회원: 주문

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/v1/my/orders` | 장바구니로 주문 생성 |
| GET | `/api/v1/my/orders` | 주문 내역 (기간: 1/3/6/12개월) |
| GET | `/api/v1/my/orders/{id}` | 주문 상세 |
| DELETE | `/api/v1/my/orders/{id}` | 주문 취소 (취소 가능한 상태일 때만) |

주문 상태 예시: `PLACED` → `PREPARING` → `DONE`, 취소 시 `CANCELED`.

### 4.5 랜딩 페이지 / 대시보드

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/v1/landing` | 랜딩 페이지용 데이터 (추천 메뉴, 카테고리 요약 등) |
| GET | `/api/v1/my/dashboard` | 회원 대시보드 (최근 주문, 장바구니 요약, 좋아요 수 등) |
| GET | `/api/v1/admin/dashboard` | 관리자 대시보드 (메뉴 수, 오늘 주문 수, 매출 요약 등) |

프론트엔드 README에는 `/api/my/favorites`(좋아요)도 있으나 **지시서의 기능 목록에는 없다.** 지시서를 우선하고, 좋아요는 이번 범위에서 제외한다.

## 5. 인증/인가에 대한 결정 사항

지시서에는 "관리자", "회원", "사용자"가 구분돼 있지만 Spring Security 등 인증 라이브러리는 추가하지 말라는 제약(최소 라이브러리)이 있다. 이번 범위에서는 아래처럼 단순화한다.

- 인증/인가는 **구현하지 않는다.** `/my/**`는 임시로 고정 회원 ID(예: `1`)를 사용하는 것으로 가정한다.
- 인증이 필요해지면 라이브러리 추가 여부를 사용자와 먼저 상의한다.

## 6. 구현 순서와 완료 체크리스트

단계 순서대로 구현하고, 각 단계의 **완료 확인**을 모두 통과해야 다음 단계로 넘어간다. 완료한 항목은 `[ ]`를 `[x]`로 바꾼다. 확인용 명령은 서버를 `./gradlew bootRun`으로 띄운 상태에서 `curl`로 실행한다 (Postman도 동일).

### 단계 0. 사전 확정

- [ ] 패키지명 확정 (`com.new-cafe.backend`는 사용 불가, 기본값 `com.newcafe.backend`)
- [ ] §7의 확인 항목(저장소, 인증, 좋아요 제외 등) 합의

### 단계 1. 프로젝트 골격

만들 것: `settings.gradle`(`rootProject.name = 'backend'`), `build.gradle`(Java 21, `starter-webmvc`, `starter-webmvc-test`만), Gradle Wrapper, `BackendApplication`, 빈 패키지 폴더(§3 구조)

완료 확인
- [x] `./gradlew build`가 성공한다
- [x] 의존성이 `starter-webmvc`와 `starter-webmvc-test`뿐이다 (`./gradlew dependencies --configuration runtimeClasspath`로 JPA·Lombok 없음 확인)
- [x] `./gradlew bootRun` 로그에 `Tomcat started on port 8080`과 `Started BackendApplication`이 보인다
- [x] `java -version`/Gradle toolchain이 21이다

### 단계 2. 공통 예외 처리

만들 것: `common/exception/NotFoundException`, `common/exception/GlobalExceptionHandler` (NotFound→404, IllegalState→409, 본문 `{"message": "..."}`)

완료 확인
- [x] 컴파일이 통과하고 서버가 기동된다
- [x] 존재하지 않는 경로 요청이 에러 없이 404를 반환한다

### 단계 3. JPA와 데이터베이스 설정

전제: 팀 프로젝트 DB는 클라우드 서버에 있다. 노트북 Docker의 `postgres-team`(5432)은 데스크탑에서 쓰는 **연습용 DB**로, 백엔드와는 연결하지 않는다.

| 항목 | 값 |
|---|---|
| 서버 | `cloud.newlecture.com` (SSH 접속: `ssh jykim@cloud.newlecture.com`) |
| 컨테이너 | `postgres-team-4` (`postgres:16`, 볼륨 `/var/lib/postgresql/data`) |
| 포트 | `5444` (할당받은 포트, 서버 5444 → 컨테이너 5432) |
| DB / 사용자 | `ncafedb` / `ncafe` (팀 공용 DB 자료의 6~8단계로 생성) |
| 연결 방식 | 노트북에서 5444 직접 연결 가능 확인됨 (2026-10-06). SSH 터널 불필요 |

만들 것
- `build.gradle`: `implementation 'org.springframework.boot:spring-boot-starter-data-jpa'`, `runtimeOnly 'org.postgresql:postgresql'`
- `application.properties`:
  ```properties
  spring.config.import=optional:file:./secret.properties
  spring.datasource.url=jdbc:postgresql://cloud.newlecture.com:5444/ncafedb
  spring.datasource.username=ncafe
  spring.datasource.password=${DB_PASSWORD}
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.open-in-view=false
  spring.jpa.show-sql=true
  spring.sql.init.mode=always
  spring.jpa.defer-datasource-initialization=true
  ```
  - `ddl-auto=update`: 개발용. 엔티티를 보고 테이블을 자동 생성/수정한다.
  - `defer-datasource-initialization`: 테이블이 만들어진 뒤에 `data.sql`이 실행되게 한다 (단계 4에서 사용).
  - 비밀번호는 인터넷에 열린 서버의 것이므로 소스에 쓰지 않는다. 프로젝트 루트의 `secret.properties`(`DB_PASSWORD=...`)에 두고 `.gitignore`로 Git에서 제외한다. 같은 이름의 환경변수가 있으면 그 값이 우선한다.
- `secret.properties`(Git 제외), `secret.properties.example`(빈 값 예시, Git 포함), `.gitignore`에 `secret.properties` 추가
  - 클라우드 DB의 테이블은 이 프로젝트 전용이므로 `ddl-auto=update`를 쓴다. 다른 팀과 같은 DB를 공유하게 되면 `validate`로 바꾼다.

완료 확인
- [x] 클라우드 서버에서 `docker ps`에 `postgres-team-4`가 `Up`, `0.0.0.0:5444->5432/tcp`로 보인다
- [x] 노트북에서 `psql -h cloud.newlecture.com -p 5444 -U ncafe -d ncafedb`로 로그인된다 (psql이 없으면 서버에서 `docker exec -it postgres-team-4 psql -U ncafe -d ncafedb`)
- [x] `application.properties`와 소스 어디에도 비밀번호가 적혀 있지 않다
- [x] 런타임 의존성에 `data-jpa`와 `postgresql`이 추가됐고, Lombok 등 다른 라이브러리는 없다
- [x] `./gradlew bootRun` 로그에 `HikariPool-1 - Start completed`와 `Started BackendApplication`이 보인다
- [x] `./gradlew build`가 성공한다 (테스트 `contextLoads`도 클라우드 DB에 접속하므로 `secret.properties`가 있어야 한다)
- [x] 단계 2까지의 동작(없는 경로 404)이 그대로다

### 단계 4. 관리자 메뉴 관리 (admin)

만들 것
- `entity`: `Category`, `Menu`
- `repository`: `MenuRepository`, `CategoryRepository`
- `resources/data.sql`: 샘플 카테고리(커피/음료/디저트)와 메뉴. 재기동 때 중복되지 않게 `ON CONFLICT (id) DO NOTHING`, 직접 넣은 id 뒤로 시퀀스를 맞추는 `setval` 포함
- `dto/admin/menu`: `MenuCreateRequestDto`, `MenuUpdateRequestDto`, `AdminMenuResponseDto`
- `service/admin`: `AdminMenuService`, `DfAdminMenuService`
- `controller/admin`: `AdminMenuController`

완료 확인
- [ ] 서버를 두 번 재기동해도 샘플 데이터가 중복되지 않는다
- [ ] `GET /api/v1/admin/menus` → 200, **body 없이** 호출돼도 비공개 포함 전체 목록 응답
- [ ] `POST /api/v1/admin/menus` (JSON body) → 201, 생성된 메뉴 응답
- [ ] 방금 만든 메뉴가 `GET /api/v1/admin/menus/{id}`로 조회된다
- [ ] `GET /api/v1/admin/menus/999` → 404 (`message` 포함)
- [ ] `PUT /api/v1/admin/menus/{id}` → 200, 수정 값이 반영된다
- [ ] `DELETE /api/v1/admin/menus/{id}` → 204, 이후 같은 id 조회 시 404
- [ ] 새로 등록한 메뉴의 id가 샘플 데이터 id와 충돌하지 않는다 (시퀀스 정상)
- [ ] 서버를 재기동해도 등록·수정한 메뉴가 유지된다 (DB에 저장됨)

### 단계 5. 사용자 메뉴 조회 (anon)

만들 것 (엔티티·Repository·샘플 데이터는 단계 4에서 만든 것을 쓴다)
- `dto/anon/menu`: `MenuListRequestDto`, `MenuListResponseDto`, `MenuDetailResponseDto`, `CategoryListResponseDto`
- `service/anon`: `MenuService`, `DfMenuService`, `CategoryService`, `DfCategoryService`
- `controller/anon`: `MenuController`

완료 확인
- [ ] 서버 기동 시 빈 이름 충돌(`ConflictingBeanDefinitionException`)이 없다 (관리자 쪽 `AdminMenuController`와 공존)
- [ ] `GET /api/v1/menus` → 200, 공개(visible) 메뉴만 **배열**로 응답
- [ ] `GET /api/v1/menus?category=1` → 해당 카테고리 메뉴만 응답
- [ ] `GET /api/v1/menus?sort=price` → 가격순으로 정렬
- [ ] `GET /api/v1/menus/categories` → 카테고리 목록과 공개 메뉴 수(`count`)
- [ ] `GET /api/v1/menus/1` → 200, 상세 응답
- [ ] `GET /api/v1/menus/999` → 404 (`message` 포함)
- [ ] 관리자 API로 `visible=false`로 만든 메뉴가 `GET /api/v1/menus`에는 안 보이고 admin 목록에는 보인다
- [ ] 프론트엔드가 호출하는 경로 `/api/v1/menus`, `/api/v1/menus/categories`와 일치한다

### 단계 6. 회원 장바구니 (member)

만들 것
- `entity`: `CartItem`
- `repository`: `CartItemRepository`
- `dto/member/cart`: `CartItemAddRequestDto`, `CartItemUpdateRequestDto`, `CartItemResponseDto`, `CartResponseDto`
- `service/member`: `CartService`, `DfCartService`
- `controller/member`: `CartController`

완료 확인
- [ ] `POST /api/v1/my/basket/items` → 메뉴 담기, 응답에 `items`와 `totalPrice`
- [ ] 같은 메뉴를 다시 담으면 항목이 늘지 않고 **수량이 합산**된다
- [ ] 비공개/없는 메뉴를 담으면 404
- [ ] `PUT /api/v1/my/basket/items/{itemId}` → 수량이 변경된다
- [ ] `DELETE /api/v1/my/basket/items/{itemId}` → 204, 장바구니에서 사라진다
- [ ] `GET /api/v1/my/basket` → 합계(`totalPrice`)가 수량×단가 합과 일치한다

### 단계 7. 회원 주문 (member)

만들 것
- `entity`: `Order`, `OrderItem`, `OrderStatus`
- `repository`: `OrderRepository`
- `dto/member/order`: `OrderItemResponseDto`, `OrderResponseDto`
- `service/member`: `OrderService`, `DfOrderService`
- `controller/member`: `OrderController`

완료 확인
- [ ] 장바구니가 있을 때 `POST /api/v1/my/orders` → 201, 상태 `PLACED`, 합계가 맞다
- [ ] 주문 후 장바구니가 비워진다
- [ ] 장바구니가 비었을 때 주문하면 409
- [ ] 주문 항목의 메뉴명·가격이 주문 시점 값이다 (이후 메뉴 가격을 바꿔도 주문 내역은 그대로)
- [ ] `GET /api/v1/my/orders` → 최신순 목록, `?months=1`처럼 기간 필터가 동작한다
- [ ] `GET /api/v1/my/orders/{id}` → 상세, 없는 id는 404
- [ ] `DELETE /api/v1/my/orders/{id}` → `PLACED` 상태만 취소되고, 이미 취소/진행된 주문은 409

### 단계 8. 랜딩과 대시보드

만들 것
- `dto/anon/landing`: `LandingResponseDto`, `dto/member/dashboard`: `MemberDashboardResponseDto`, `dto/admin/dashboard`: `AdminDashboardResponseDto`
- `service/anon`: `LandingService`, `DfLandingService`
- `service/member`: `MemberDashboardService`, `DfMemberDashboardService`
- `service/admin`: `AdminDashboardService`, `DfAdminDashboardService`
- `controller`: `anon/LandingController`, `member/MemberDashboardController`, `admin/AdminDashboardController`

완료 확인
- [ ] `GET /api/v1/landing` → 추천 메뉴(최대 4개)와 카테고리 목록
- [ ] `GET /api/v1/my/dashboard` → 장바구니 항목 수와 최근 주문 3건
- [ ] `GET /api/v1/admin/dashboard` → 메뉴 수, 오늘 주문 수(취소 제외), 오늘 매출
- [ ] 주문을 만들거나 취소하면 관리자 대시보드 수치가 그에 맞게 바뀐다
- [ ] 서비스 간 순환 의존이 없다 (서버가 정상 기동)

### 단계 9. CORS와 프론트엔드 연동

만들 것: `common/config/WebConfig`(`WebMvcConfigurer` 구현)로 프론트엔드 출처(`http://localhost:3000`)의 `/api/**` 요청 허용 (라이브러리 추가 없음)

완료 확인
- [ ] `curl -i -H "Origin: http://localhost:3000" http://localhost:8080/api/v1/menus` 응답에 `Access-Control-Allow-Origin`이 있다
- [ ] 프론트엔드(`npm run dev`)에서 메뉴 목록과 카테고리 필터가 실제 데이터로 표시된다
- [ ] 브라우저 콘솔에 CORS 오류가 없다

### 단계 10. 최종 점검

- [ ] `./gradlew clean build`가 경고 없이 성공한다
- [ ] 의존성이 `webmvc`, `data-jpa`, `postgresql`(+테스트)뿐이고 Lombok 등은 없다
- [ ] 엔티티가 컨트롤러 응답에 직접 노출되지 않는다 (모두 DTO로 변환)
- [ ] 계층 규칙 준수: Controller가 Repository를 직접 호출하지 않는다, 필드 주입(`@Autowired`)이 없다
- [ ] §4의 모든 API 경로가 구현되어 있다 (경로 목록과 대조)
- [ ] 같은 노트북 환경에서 데스크탑 Postman으로 `http://192.168.0.150:8080/api/v1/menus` 호출이 된다

## 7. 확인이 필요한 항목

| 번호 | 항목 | 기본 가정 |
|---|---|---|
| 1 | 패키지명 (`com.new-cafe.backend`는 사용 불가) | `com.newcafe.backend` |
| 2 | 데이터 저장소 | **확정**: JPA + PostgreSQL 16 (`cloud.newlecture.com:5444`, 컨테이너 `postgres-team-4`, `ncafedb`, 사용자 `ncafe`). 지시서의 JPA 금지를 변경함. 노트북 `postgres-team`은 연습용 |
| 3 | 인증/인가 | 이번 범위에서 제외 |
| 4 | 좋아요(favorites) 기능 | 지시서에 없으므로 제외 |
| 5 | 이전 `backend` 코드(삭제됨)를 참고할지 | 참고하지 않고 새로 작성 |
