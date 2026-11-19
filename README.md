# nyan cafe

재료를 연금솥에 넣어 나만의 포션(음료)을 조합하고, 장바구니·모의 결제·레시피 도감까지 이어지는 고양이 연금술 카페 웹 서비스입니다.

팀 프로젝트 · 저장소: [DavidLee534/ncafe7-team-4](https://github.com/DavidLee534/ncafe7-team-4)

## Demo

- 로컬 시연 순서: [docs/demo-guide.md](docs/demo-guide.md)
- 배포 URL: *(추가 예정)*

시연용 시드 계정 비밀번호는 모두 `ncafe1234`입니다. **로컬/데모 전용**이며 운영 환경에 쓰지 마세요.

## Features

- **연금 공방** — 계열별 기반 재료 + 추가 재료로 포션 조합, 실시간 가격·액체 색 반영
- **이름·등급 생성** — 수식어·효과 태그 규칙과 비밀 레시피 매칭 (서버에서 계산)
- **감정 연금술** — 오늘의 기분·끌리는 맛으로 기본 메뉴 추천
- **주문 플로우** — 장바구니 → 모의 결제 → 주문 상태 관리
- **레시피 도감** — 내가 만든 포션·발견한 비밀 레시피 수집
- **포션 자랑** — 게시글·별점·댓글
- **관리자** — 메뉴·재료·회원·주문·비밀 레시피 CRUD

## Tech Stack

| 구분 | 기술 |
|------|------|
| Frontend | Next.js, TypeScript, React |
| Backend | Spring Boot, Spring Security, Spring Data JPA |
| DB | PostgreSQL (로컬), H2 (테스트) |
| Auth | 세션 쿠키 + BCrypt |

## Architecture

```text
Browser (Next.js :3000)
   └─ /api/v1/*  rewrite ──▶ Spring Boot (:8080)
                                 └─ PostgreSQL
```

프론트는 Next.js rewrites로 같은 origin에서 API를 호출합니다.  
가격·등급·비밀 레시피는 서버에서 계산해 클라이언트 조작을 막습니다.

## Getting Started

### 사전 요구

- Java 21, Node.js, Docker

### 1) DB (처음 한 번)

```bash
docker run -d --name ncafe-postgres --restart unless-stopped \
  -p 5432:5432 \
  -e POSTGRES_DB=ncafedb \
  -e POSTGRES_USER=ncafe \
  -e POSTGRES_PASSWORD=<비밀번호> \
  -v ncafe-pgdata:/var/lib/postgresql/data \
  postgres:16
```

자세한 설명: [docs/local-db.md](docs/local-db.md)

### 2) Backend

```bash
cd backend
cp secret.properties.example secret.properties
# secret.properties 에 DB_PASSWORD 를 컨테이너와 같게 입력
./gradlew bootRun
```

### 3) 시드 데이터 (백엔드가 뜬 뒤, 다른 터미널)

```bash
cd backend
sed -E "s/listagg\(cast\(id as varchar\), ','\) within group \(order by id\)/string_agg(cast(id as varchar), ',' order by id)/" \
  src/main/resources/data.sql \
  | docker exec -i ncafe-postgres psql -v ON_ERROR_STOP=1 -U ncafe -d ncafedb
```

### 4) Frontend

```bash
cd frontend
npm install
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

## My Contribution

저장소 오너([@DavidLee534](https://github.com/DavidLee534)) 기준으로 커밋 이력에 드러난 담당입니다.

- 손님용 **연금 공방** UI (재료 선택·솥 연출·감정 연금술 분리)
- 메뉴/회원 경험 프론트 (메뉴 화면, 멤버십 배지, 데모 회원 플로우)
- 관리자 고양이 카페 테마 적용
- 메뉴 관리 API 및 DB 비밀번호 외부화 (`secret.properties`)
- 회원·주문·포션 자랑 기능 통합 및 브랜치 병합

> 팀원별 세부 기여는 PR·커밋 이력(`develop`)을 참고해 주세요. 본인 담당이 다르면 이 섹션만 고치면 됩니다.

## Known Limitations

- 메인 페이지(`/`)는 정적 화면이며 추천 메뉴 API 미연결
- 포션 등급 규칙은 간이 버전 (추가 재료 수 기반)
- 결제는 모의 결제

## Docs

- [시연 가이드](docs/demo-guide.md)
- [로컬 DB 설정](docs/local-db.md)
- [기능 청사진](docs/blueprints/README.md)
- [제품·기획 명세 (구 README)](docs/product-spec.md)
