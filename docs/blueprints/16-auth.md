# 16.0 인증 · 인가

회원가입·로그인·로그아웃, 그리고 관리자 화면 보호. **마지막에 붙인다.** 그 전까지 회원 기능은 `CurrentMember`(1번 회원)로 만든다.

- 엔티티: `Member` (`email` 중복 불가, `password` 는 해시, `role`)
- 지금 프론트: `frontend/app/login/`, `frontend/app/signup/` (목업)

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 회원가입 | `/signup` | `POST /api/v1/auth/signup` 본문 `{email, password, nickname}` |
| 로그인 | `/login` | `POST /api/v1/auth/login` 본문 `{email, password}` |
| 로그아웃 | 헤더 버튼 | `POST /api/v1/auth/logout` |
| (현재 회원 확인) | 헤더 | `GET /api/v1/my/account` (14.0 재사용) |

## 파일

```
controller/AuthController.java
service/AuthService.java, DfAuthService.java
dto/auth/
  SignupRequestDto   email(@Email), password(8자 이상), nickname(20자)
  LoginRequestDto    email, password
  SignupResponseDto / LoginResponseDto   id, email, nickname, role  (password X)
config/SecurityConfig.java   (spring-boot-starter-security 추가 시)
```

## 붙일 때 바꾸는 곳

1. `common/auth/CurrentMember.id()` → 로그인한 회원의 id 를 돌려주게 바꾼다. **회원 기능 코드는 그대로**
2. `/api/v1/my/**`, 장바구니·주문·포션 자랑 쓰기 → 로그인 필요 (401)
3. `/api/v1/admin/**`, `/admin/**` → `role=admin` 만 (403) — 이게 "인가"
4. `status=suspended` 회원은 로그인 거부
5. `data.sql` 의 `password` 값(`not-set`)을 해시로 바꾸고, 시작 데이터 회원으로 로그인 테스트

## 정할 것

- 세션(쿠키) 방식 vs 토큰(JWT) 방식. 프론트(Next, 3000)와 백엔드(8080)가 rewrites 로 같은 주소처럼 보이므로 **세션 쿠키가 단순**
- security 프로젝트(`~/Workspace2/security`)에서 연습한 설정을 참고
