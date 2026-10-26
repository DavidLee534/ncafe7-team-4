# 10.0 레시피 조회 — 도감 (회원)

회원이 만든 포션과 발견한 비밀 레시피를 도감으로 본다. 탭(기본/비밀)과 필터는 쿼리로 둔다.

- 엔티티: `Recipe`, `SecretRecipe`, `SecretRecipeDiscovery`
- 지금 프론트: `frontend/app/codex/` (목업, 데이터는 `lib/codex.ts`). 주소는 `/my/recipes` 로
- 시작 데이터: 모카손님(1번)은 포션 3개, 비밀 레시피 2개 발견

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 도감 목록 조회 | `/my/recipes?filter=` | `GET /api/v1/my/recipes` |
| | | `GET /api/v1/my/recipes/summary` |
| 도감 상세 조회 | `/my/recipes?id={id}` | `GET /api/v1/my/recipes/{id}` |
| 비밀 레시피 목록 조회 | `/my/recipes?tab=secret&filter=` | `GET /api/v1/my/secret-recipes` |
| 비밀 레시피 상세 조회 | `/my/recipes?tab=secret&id={id}` | `GET /api/v1/my/secret-recipes/{id}` |

필터(전체·발견·미발견·전설)는 프론트에서 거른다. 데이터가 작고, 칩 옆 개수와 잠긴 칸 때문에 어차피 전체가 필요하다.

## 파일

```
controller/my/RecipeController.java       @RestController("myRecipeController")
controller/my/SecretRecipeController.java @RestController("mySecretRecipeController")
service/my/... (같은 방식으로 빈 이름 지정)
dto/my/recipe/
  MyRecipeListResponseDto        id, name, grade, price, color, baseMenuName, createdAt
  MyRecipeDetailResponseDto      목록 + secretRecipeName (+ ingredients, 재료 머지 후)
  MyRecipeSummaryResponseDto     recipeCount, secretFound, secretTotal, progressRate
dto/my/secretrecipe/
  MySecretRecipeListResponseDto  id, grade, categoryName, color, discovered, discoveredAt,
                                 name·description (발견했을 때만, 아니면 null), riddle (발견 전에만)
  MySecretRecipeDetailResponseDto 목록 + customerRate (이 레시피를 찾은 회원 비율)
```

## 주의

- 비밀 레시피 목록은 `visible=true` 인 전체를 주고 `discovered` 를 붙인다. **발견하지 않은 레시피의 이름·설명은 응답에서 빼야 한다** (응답만 봐도 정답이 보이면 안 됨)
- 상세 `GET /my/recipes/{id}` 는 남의 포션이면 404 (내 것만)
