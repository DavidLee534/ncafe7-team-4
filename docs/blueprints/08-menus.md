# 8.0 메뉴 조회 (익명 사용자)

손님이 메뉴판을 보고 메뉴 상세를 본다. 로그인 없이 볼 수 있다. 공개 페이지라 상세 주소에 slug 를 쓴다.

- 엔티티: `Menu` (`slug` 컬럼 추가해 둠), `Category`
- 지금 프론트: `frontend/app/menu/` (목업). 페이지 주소를 `/menus` 로 바꾸는 것도 이 작업에서

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 메뉴 목록 조회 | `/menus` | `GET /api/v1/menus?categoryId=&keyword=` |
| | | `GET /api/v1/menus/categories` (탭) |
| | | `GET /api/v1/menus/recommendations` (사장 추천) |
| 메뉴 상세 조회 | `/menus/{slug}` | `GET /api/v1/menus/{slug}` |
| (장바구니 담기) | `/menus/{slug}` | `POST /api/v1/my/cart/items` → 11.0 장바구니 |

## 파일

```
controller/MenuController.java           @RestController("publicMenuController") — 관리자 MenuController 와 빈 이름이 겹침
service/MenuService.java, DfMenuService.java   @Service("publicMenuService") 등 이름 지정
dto/menu/
  MenuListRequestDto          categoryId, keyword
  MenuListResponseDto         id, slug, korName, engName, price, categoryName, imageUrl, status
  MenuDetailResponseDto       목록 + description
  MenuCategoryListResponseDto id, name, engName
```

## 관리자 API 와 다른 점

- `status = hidden` 인 메뉴는 목록·상세 모두에서 뺀다 (상세는 404). `soldout` 은 보여 주되 담기 버튼을 막는다
- `visible = false` 인 카테고리는 탭에서 빼고, 그 카테고리 메뉴도 뺀다
- 상세는 `findBySlug`. slug 가 없는 예전 메뉴는 공개 화면에 나오지 않는다 → 관리자 메뉴 등록·수정 폼에 slug 입력칸 추가 필요 (1.0 보완)
- 응답에 `ownerRecommended`, `createdAt` 같은 관리 정보는 넣지 않는다
