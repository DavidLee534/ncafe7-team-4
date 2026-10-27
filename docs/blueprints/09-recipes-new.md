# 9.0 레시피 등록 (회원)

연금 공방. 손님이 포션을 만들어 도감에 저장하고 장바구니에 담는다. 세 가지 방법이 있다.

- 엔티티: `Recipe`, `Menu`(기반 메뉴, 감정·맛 태그), `SecretRecipe`, `SecretRecipeDiscovery`, `Ingredient`, `RecipeIngredient`
- 지금 프론트: `frontend/app/menu/alchemy/` (목업, 데이터는 `alchemyMenus.ts`). 주소는 `/recipes/new` 로
- 기다리는 것: "재료로 만들기"의 재료 선반은 `feat/admin-ingredient` 머지 후. 감정·기본 메뉴는 바로 가능

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 재료로 레시피 만들기 | `/recipes/new` | `GET /api/v1/recipes/ingredients` (재료 선반) |
| | | `POST /api/v1/recipes` (포션 만들기 → 도감 저장) |
| 감정으로 레시피 만들기 | `/recipes/new/emotion` | `GET /api/v1/recipes/emotions` (감정·맛 목록) |
| | | `GET /api/v1/recipes/recommendations?emotion=피곤함&tastes=달콤한,시원한` |
| 기본 메뉴 고르기 | `/recipes/new/from-menu` | `GET /api/v1/recipes/menus?categoryId=` |
| (장바구니 담기) | 세 페이지 모두 | `POST /api/v1/my/cart/items` → 11.0 |

## 파일

```
controller/RecipeController.java
service/RecipeService.java, DfRecipeService.java
repository/RecipeRepository.java   (있음)
repository/MenuRepository.java     (감정·맛 태그로 찾는 쿼리 추가, 또는 서비스에서 점수 계산)
dto/recipe/
  RecipeCreateRequestDto          baseMenuId, extraIds (추가 재료 id)
  RecipeCreatedResponseDto        id, name, grade, price, color, secretRecipeName(맞혔으면), newlyDiscovered
  RecipeEmotionListResponseDto    emotions[{name, color}], tastes[]
  RecipeRecommendationResponseDto menuId, slug, korName, price, imageUrl, emotionTags, tasteTags, score
  RecipeMenuListResponseDto       menuId, korName, categoryName, price, imageUrl
```

## 규칙 (목업 `AlchemyWorkshop.tsx`, `EmotionAlchemyWorkshop.tsx` 와 같게)

- 포션 만들기 (`POST /recipes`)
  - 가격 = 기반 메뉴 가격 + 추가 재료 금액
  - 추가 재료: 계열에 열린 선반의 재료만, 제외 재료 · 숨긴 재료는 안 됨, 선반별 개수 안에서 (README "공통 재료 선반"). 어기면 400
  - 이름: README "조합 결과 규칙" (수식어 · 효과 칭호 + 기본 연금술 이름)
  - 등급: 비밀 레시피와 재료 조합이 같으면 그 레시피의 등급, 추가 재료 2개 이상이면 `rare`, 아니면 `normal`
  - 비밀 레시피를 맞히면 `Recipe.secretRecipe` 를 채우고, 처음이면 `SecretRecipeDiscovery` 저장 (`newlyDiscovered: true`)
  - 회원은 `CurrentMember.id()`
- 감정 추천: 감정 일치 3점 + 맛 일치마다 2점, 높은 순 4개 (`status=on` 메뉴만). 태그는 쉼표 문자열이라 `split(",")` 해서 비교
- 감정 6개(피곤함, 열정, 그리움, 울적함, 설렘, 긴장됨)와 맛 6개는 코드 상수로 둔다 (테이블 없음)
