# 15.0 메인 페이지 (익명 사용자)

첫 화면(`/`). 다른 시스템의 공개 API 를 모아 보여 준다. **새 API 없이** 만든다. 그래서 회원 쪽 시스템 중 마지막.

- 지금 프론트: `frontend/app/page.tsx`, `HomePage.module.css`

## 화면 부분 · API

| 화면 부분 | API | 만드는 시스템 |
|---|---|---|
| 사장 추천 메뉴 | `GET /api/v1/menus/recommendations` | 8.0 |
| 카테고리 바로가기 | `GET /api/v1/menus/categories` | 8.0 |
| 인기 포션 자랑 | `GET /api/v1/potion-showcases?sort=rating&size=3` | 13.0 |
| 연금 공방 바로가기 | 링크만 (`/recipes/new`) | — |

## 주의

- 비회원도 보는 화면이므로 `/api/v1/my/...` 를 부르지 않는다
- 포션 자랑 목록을 비회원에게도 보여 줄지는 13.0 에서 정한 대로 (지금은 회원만 → 메인에서는 빼거나, 13.0 목록 조회를 공개로)
