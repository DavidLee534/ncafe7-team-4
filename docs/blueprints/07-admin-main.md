# 7.0 관리자 메인 (관리자)

관리자 첫 화면(`/admin`, 지금 `app/admin/(dashboard)`). 다른 관리자 시스템의 숫자와 최근 항목을 모아 보여 준다.
**새 API 를 만들지 않고 각 시스템의 summary 와 목록 조건을 다시 쓴다.** 그래서 관리자 시스템 중 마지막에 만든다.

## 페이지 · API

| 화면 부분 | API | 만드는 시스템 |
|---|---|---|
| 메뉴 현황 (전체·판매중·품절·숨김) | `GET /api/v1/admin/menus/summary` | 1.0 (있음) |
| 손봐야 할 메뉴 (품절·숨김) | `GET /api/v1/admin/menus?status=soldout`, `?status=hidden` | 1.0 (있음) |
| 최근 수정 메뉴 | `GET /api/v1/admin/menus?sort=updatedAt&size=5` | 1.0 (있음) |
| 카테고리별 메뉴 수 | `GET /api/v1/admin/menus/categories` | 1.0 (있음) |
| 주문 현황 · 오늘 매출 | `GET /api/v1/admin/orders/summary` | 5.0 |
| 처리할 주문 | `GET /api/v1/admin/orders?status=paid&size=5` | 5.0 |
| 회원 수 | `GET /api/v1/admin/members/summary` | 6.0 |

WBS 의 `GET /api/v1/admin` 은 쓰지 않는다 (API 이름은 화면이 아니라 데이터).

## 할 일

- 지금 `(dashboard)/page.tsx` 는 메뉴 전체 목록과 카테고리 관리 API 를 받아 프론트에서 센다 → 위 API 로 바꾼다 (메뉴 목록 페이지에서 한 것과 같은 정리)
- `lib/adminApi.ts` 의 `countMenusByStatus` 는 이 작업이 끝나면 지운다
