# 13.0 포션 자랑 게시판 (회원)

회원이 도감에 있는 자기 포션을 골라 공유하고, 다른 회원이 별점을 주거나 그 포션을 장바구니에 담는다.

- 엔티티: `PotionShowcase`, `ShowcaseRating`, `Recipe`, `Member`
- 시작 데이터: 게시글 2개, 별점 2개
- 비회원 조회는 나중에 (지금은 회원만)

## 페이지 · API

| 스토리 | 페이지 | API |
|---|---|---|
| 목록 조회 | `/potion-showcases` | `GET /api/v1/potion-showcases?sort=&size=` (sort: latest, rating) |
| 상세 조회 | `/potion-showcases/{id}` | `GET /api/v1/potion-showcases/{id}` |
| 포션 자랑하기 | `/potion-showcases/new` | `GET /api/v1/my/recipes` (10.0, 내 포션 고르기) |
| | | `POST /api/v1/potion-showcases` |
| 별점 주기 | `/potion-showcases/{id}` | `POST /api/v1/potion-showcases/{id}/ratings` 본문 `{"score": 5}` |
| 장바구니 담기 | `/potion-showcases/{id}` | `POST /api/v1/my/cart/items` 본문 `{"recipeId": ...}` (11.0) |
| 수정 | `/potion-showcases/{id}/edit` | `GET`, `PUT /api/v1/potion-showcases/{id}` |
| 삭제 | `/potion-showcases/{id}` | `DELETE /api/v1/potion-showcases/{id}` |

## 파일

```
controller/PotionShowcaseController.java
service/PotionShowcaseService.java, DfPotionShowcaseService.java
repository/PotionShowcaseRepository.java, ShowcaseRatingRepository.java (있음)
common/exception/ForbiddenException.java   새로 추가 + GlobalExceptionHandler 에 403
dto/showcase/
  PotionShowcaseListRequestDto      sort, size
  PotionShowcaseCreateRequestDto    recipeId, title(필수 50자), content(2000자)
  PotionShowcaseUpdateRequestDto    title, content
  PotionShowcaseListResponseDto     id, title, nickname, recipeName, recipeGrade, recipeColor, averageScore, ratingCount, createdAt
  PotionShowcaseDetailResponseDto   목록 + content, recipeId, recipePrice, myScore, mine(내 글인지)
  PotionShowcaseCreatedResponseDto / PotionShowcaseUpdatedResponseDto
  ShowcaseRatingRequestDto          score (@Min(1) @Max(5))
  ShowcaseRatingResponseDto         averageScore, ratingCount, myScore
```

## 규칙

- 자랑할 포션은 **내 포션만** (`recipe.member.id == currentMember.id()` 아니면 409)
- 수정·삭제는 글쓴이만 → 아니면 403
- 별점: 이미 준 글이면 `rating.changeScore(score)`, 처음이면 새로 저장. 자기 글에는 별점 못 줌(409)
- 평균 별점은 목록에서 글마다 계산하면 N+1 → `avg`, `count` 를 `group by` 한 번으로
- 삭제할 때 별점도 같이 지운다 (외래키)
