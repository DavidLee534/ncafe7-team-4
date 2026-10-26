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
- 삭제: 주문·포션·게시글이 회원을 참조하므로 그냥 지우면 외래키 오류. 마이페이지 탈퇴(14.0)와 같이 정해야 함
  - 권장: 실제 삭제 대신 `status` 에 `withdrawn`(탈퇴)을 추가하고 이메일·닉네임을 지운다. 지금 상태 값(`active|suspended`)에 하나 추가하는 일이라 팀 확인 필요
- 관리자(`role=admin`) 자신은 정지·삭제 못 하게 409
