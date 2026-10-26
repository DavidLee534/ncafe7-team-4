# 4.0 비밀 레시피 관리 (관리자)

관리자가 비밀 레시피(정해 둔 재료 조합)를 등록·수정하고, 어떤 회원이 발견했는지 본다.

- 엔티티: `SecretRecipe`, `SecretRecipeDiscovery`, `Category` (+ 재료 머지 후 `SecretRecipeIngredient`)
- 기다리는 것: 재료 조합 부분은 `feat/admin-ingredient` 머지 후. 그 전에는 재료 없이 CRUD 먼저

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 목록 조회 | `/admin/secret-recipes` | `GET /api/v1/admin/secret-recipes?grade=&categoryId=&keyword=` |
| | | `GET /api/v1/admin/secret-recipes/summary` (등급별 개수, 발견 횟수) |
| 등록 | `/admin/secret-recipes/create` | `GET /api/v1/admin/secret-recipes/categories` (계열 선택) |
| | | `GET /api/v1/admin/secret-recipes/ingredients` (재료 선택, 재료 머지 후) |
| | | `POST /api/v1/admin/secret-recipes` |
| 상세 조회 | `/admin/secret-recipes/{id}` | `GET /api/v1/admin/secret-recipes/{id}` |
| | | `GET /api/v1/admin/secret-recipes/{id}/discoveries` (발견한 회원 목록) |
| 수정 | `/admin/secret-recipes/{id}/edit` | `GET /api/v1/admin/secret-recipes/{id}`, `PUT /api/v1/admin/secret-recipes/{id}` |
| 삭제 | `/admin/secret-recipes/{id}` | `DELETE /api/v1/admin/secret-recipes/{id}` |

## 파일

```
controller/admin/SecretRecipeController.java
service/admin/SecretRecipeService.java, DfSecretRecipeService.java
repository/SecretRecipeRepository.java          (있음 — 검색 쿼리 추가)
repository/SecretRecipeDiscoveryRepository.java (있음 — 발견 목록 조회 추가)
dto/admin/secretrecipe/
  SecretRecipeListRequestDto        grade, categoryId, keyword
  SecretRecipeCreateRequestDto      name, grade, categoryId, color, description, riddle, visible (+ ingredientIds)
  SecretRecipeUpdateRequestDto      위와 같음
  SecretRecipeListResponseDto       id, name, grade, categoryName, color, visible, discoveryCount
  SecretRecipeDetailResponseDto     목록 + description, riddle, createdAt, updatedAt (+ ingredients)
  SecretRecipeCreatedResponseDto / SecretRecipeUpdatedResponseDto
  SecretRecipeSummaryResponseDto    all, rare, legend, discoveries
  SecretRecipeCategoryListResponseDto  id, name
  SecretRecipeDiscoveryListResponseDto memberId, nickname, discoveredAt
```

## 검증

- `name` 필수·30자 이하·중복이면 409, `grade` 는 `rare|legend`, `color` 는 `^#[0-9A-Fa-f]{6}$` (재료 DTO 와 같은 규칙)
- `riddle` 500자, `description` 1000자

## 주의

- 발견 기록이 있는 레시피 삭제: 발견 기록과 회원 포션(`Recipe.secretRecipe`)이 참조하므로 409 로 막거나 숨김(`visible=false`)으로 대신한다. **숨김 권장**
- 목록의 `discoveryCount` 는 레시피마다 세면 N+1 → `group by` 쿼리 하나로
