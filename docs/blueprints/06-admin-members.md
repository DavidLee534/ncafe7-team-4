# 6.0 회원 관리 (관리자)

회원 목록을 보고, 회원을 정지·해제하거나 삭제한다.

- 엔티티: `Member` (+ 상세에서 주문 수·포션 수를 보여 주면 `Order`, `Recipe`)
- 시작 데이터: 회원 4명 (관리자 1, 정지 1 포함)

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 목록 조회 | `/admin/members` | `GET /api/v1/admin/members?keyword=&status=&role=` (keyword: 이메일·닉네임) |
| | | `GET /api/v1/admin/members/summary` (전체, 정상, 정지) |
| 상세 조회 | `/admin/members/{id}` | `GET /api/v1/admin/members/{id}` |
| 상태 변경 | `/admin/members/{id}` | `PATCH /api/v1/admin/members/{id}/status` 본문 `{"status": "suspended"}` |
| 삭제 | `/admin/members/{id}` | `DELETE /api/v1/admin/members/{id}` |

## 파일

```
controller/admin/MemberController.java
service/admin/MemberService.java, DfMemberService.java
repository/MemberRepository.java   (있음 — 검색 쿼리, existsByEmail 등 추가)
dto/admin/member/
  MemberListRequestDto       keyword, status, role
  MemberStatusRequestDto     status (@Pattern "active|suspended")
  MemberListResponseDto      id, email, nickname, role, status, createdAt
  MemberDetailResponseDto    목록 + orderCount, recipeCount, updatedAt
  MemberStatusResponseDto    id, status, updatedAt
  MemberSummaryResponseDto   all, active, suspended
```

## 주의

- **응답에 `password` 를 절대 넣지 않는다**
- 삭제 (구현됨): 주문·포션·자랑글이 있는 회원은 409 → 대신 정지로 바꾼다. 장바구니·비밀 레시피 발견 기록·준 별점은 회원과 함께 지운다
  - 마이페이지 탈퇴(14.0)를 만들 때 다시 볼 것: 주문이 있는 회원도 탈퇴할 수 있어야 하면 `status` 에 `withdrawn`(탈퇴)을 추가하고 이메일·닉네임을 지우는 방식으로 바꾼다 (팀 확인 필요)
- 관리자(`role=admin`) 계정은 정지·삭제 못 하게 409 (구현됨)
