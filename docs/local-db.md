# 로컬 DB (Docker · PostgreSQL 16)

팀원 모두 아래 값으로 각자 컴퓨터에 PostgreSQL 컨테이너를 하나 띄웁니다.

| 항목 | 값 |
|---|---|
| 이미지(버전) | `postgres:16` |
| 컨테이너 이름 | `ncafe-postgres` |
| DB 이름 | `ncafedb` |
| 사용자 | `ncafe` |
| 비밀번호 | 팀 공용 개발용 비밀번호 (메신저로 공유, **깃에 올리지 않음**) |
| 포트 | `5432` |

## 처음 한 번

### 1. 컨테이너 만들기

`<비밀번호>` 자리에 팀 비밀번호를 넣고 한 줄로 실행합니다. (터미널·PowerShell·cmd 모두 같음)

```bash
docker run -d --name ncafe-postgres --restart unless-stopped -p 5432:5432 -e POSTGRES_DB=ncafedb -e POSTGRES_USER=ncafe -e POSTGRES_PASSWORD=<비밀번호> -v ncafe-pgdata:/var/lib/postgresql/data postgres:16
```

| 옵션 | 뜻 |
|---|---|
| `-d` | 백그라운드로 실행 |
| `--name ncafe-postgres` | 컨테이너 이름 |
| `--restart unless-stopped` | 컴퓨터·Docker 를 다시 켜면 자동으로 켜짐 (직접 `docker stop` 한 경우는 제외) |
| `-p 5432:5432` | 내 컴퓨터 5432 → 컨테이너 5432 |
| `-e POSTGRES_DB/USER/PASSWORD` | 처음 뜰 때 이 DB·사용자·비밀번호를 만든다 |
| `-v ncafe-pgdata:/var/lib/postgresql/data` | 데이터를 볼륨에 저장. 컨테이너를 지워도 데이터가 남는다 |

```bash
docker ps   # ncafe-postgres 가 Up 이면 성공
```

### 2. `backend/secret.properties` 만들기

이 파일은 깃에서 빠져 있습니다. 비밀번호는 1번과 같은 값.

```properties
DB_URL=jdbc:postgresql://localhost:5432/ncafedb
DB_PASSWORD=<비밀번호>
```

### 3. 백엔드 실행

```bash
cd backend
bash ./gradlew bootRun
```

`ddl-auto: update` 가 엔티티를 보고 테이블을 만듭니다. `Started BackendApplication` 이 보이면 켜 둔 채로 4번으로 갑니다.

### 4. 시작 데이터 넣기 (3 다음에, 한 번만)

다른 터미널의 `backend` 폴더에서:

```bash
sed -E "s/listagg\(cast\(id as varchar\), ','\) within group \(order by id\)/string_agg(cast(id as varchar), ',' order by id)/" \
  src/main/resources/data.sql \
  | docker exec -i ncafe-postgres psql -v ON_ERROR_STOP=1 -U ncafe -d ncafedb
```

- `data.sql` 은 H2 에서는 켤 때 자동으로 들어가지만 PostgreSQL 에는 이렇게 직접 넣습니다
- `data.sql` 의 비밀 레시피 조합은 H2 함수(`listagg`)로 만들어서 PostgreSQL 에서는 오류가 납니다. 위 명령은 그 부분만 PostgreSQL 함수(`string_agg`)로 바꿔서 넣습니다. 저장소의 파일은 바뀌지 않습니다
- `sed` 가 없는 PowerShell 에서는 Git Bash 나 WSL 에서 실행합니다
- 테이블이 있어야 하므로 꼭 3(백엔드 실행) 다음에
- 들어가는 것: 회원 4, 카테고리 8, 메뉴 30, 재료 73, 비밀 레시피 8(재료 조합 포함), 포션 4, 장바구니 2, 주문 6, 자랑글 2
- 회원 비밀번호는 모두 `ncafe1234` (`admin@ncafe.dev` 관리자, `tofu@ncafe.dev` 정지 회원). 계정별 쓰임은 [demo-guide.md](demo-guide.md)
- 두 번 넣으면 이름 중복 오류가 납니다. 처음부터 다시 하려면 아래 "데이터만 비우기"

확인:

```bash
docker exec ncafe-postgres psql -U ncafe -d ncafedb -c "select count(*) from secret_recipes where ingredient_combo is not null"
```

`8` 이 나오면 됩니다.

## 자주 쓰는 명령

| 하는 일 | 명령 |
|---|---|
| 상태 보기 | `docker ps -a` |
| 켜기 | `docker start ncafe-postgres` |
| 끄기 (데이터 유지) | `docker stop ncafe-postgres` |
| DB 접속 (psql) | `docker exec -it ncafe-postgres psql -U ncafe -d ncafedb` |
| 테이블 보기 | psql 안에서 `\dt`, 나가기 `\q` |
| 데이터만 비우기 (테이블까지 삭제) | `docker exec ncafe-postgres psql -U ncafe -d ncafedb -c 'drop schema public cascade; create schema public;'` → 3, 4 다시 |
| 완전히 초기화 (컨테이너 · 볼륨 삭제) | `docker rm -f ncafe-postgres` → `docker volume rm ncafe-pgdata` → 처음 한 번 1~4 |

`docker run` 은 컨테이너를 **새로 만드는** 명령이라 한 번만 씁니다. 그 뒤로는 `docker start` / `docker stop`.

## 문제가 생기면

- **포트 5432 가 이미 사용 중:** 다른 PostgreSQL 이 떠 있음. 그걸 `docker stop` 하거나, `-p 5433:5432` 로 만들고 `DB_URL` 도 `localhost:5433` 으로
- **`ncafe-postgres` 이름이 이미 있음:** 예전에 만든 컨테이너가 있음. `docker start ncafe-postgres` 로 켜거나, 초기화 후 다시 `docker run`
- **비밀번호를 바꿨는데 접속이 안 됨:** 비밀번호는 볼륨을 처음 만들 때만 정해집니다. 완전히 초기화한 뒤 다시 `docker run`
- **예전에 만든 DB 라 로그인이 안 되거나 재료 선반이 비어 있음:** 예전 시작 데이터(비밀번호 `not-set`, 재료 없음)가 들어 있는 것. "데이터만 비우기" 후 3, 4 를 다시 합니다
- **H2 로 빠르게 테스트하고 싶을 때:** Docker 없이 `./gradlew bootRun --args='--spring.profiles.active=h2'` (메모리 DB, 켤 때 `data.sql` 이 자동으로 들어가고 끄면 사라짐)
