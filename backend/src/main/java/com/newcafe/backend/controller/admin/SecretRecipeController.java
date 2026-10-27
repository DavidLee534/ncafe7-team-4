package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeCategoryListResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeCreateRequestDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeCreatedResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeDetailResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeDiscoveryListResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeListRequestDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeListResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeSummaryResponseDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeUpdateRequestDto;
import com.newcafe.backend.dto.admin.secretrecipe.SecretRecipeUpdatedResponseDto;
import com.newcafe.backend.service.admin.SecretRecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/secret-recipes")
@RequiredArgsConstructor
public class SecretRecipeController {

  private final SecretRecipeService secretRecipeService;

  // 비밀 레시피 등록. 성공하면 201과 저장된 레시피. 같은 이름이 있으면 409
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public SecretRecipeCreatedResponseDto create(@Valid @RequestBody SecretRecipeCreateRequestDto request) {
    return secretRecipeService.create(request);
  }

  // 비밀 레시피 목록. 쿼리스트링의 조건(?grade=&categoryId=&keyword=)으로 거른다. 조건이 없으면 전체
  @GetMapping
  public List<SecretRecipeListResponseDto> getList(@ModelAttribute SecretRecipeListRequestDto request) {
    return secretRecipeService.getList(request);
  }

  // 등급별 레시피 수와 전체 발견 기록 수 (목록 상단)
  @GetMapping("/summary")
  public SecretRecipeSummaryResponseDto getSummary() {
    return secretRecipeService.getSummary();
  }

  // 등록·수정 화면의 계열 선택 상자 (곁다리 데이터)
  @GetMapping("/categories")
  public List<SecretRecipeCategoryListResponseDto> getCategories() {
    return secretRecipeService.getCategories();
  }

  // 비밀 레시피 상세. 없는 id면 404
  @GetMapping("/{id}")
  public SecretRecipeDetailResponseDto getDetail(@PathVariable Long id) {
    return secretRecipeService.getDetail(id);
  }

  // 이 레시피를 발견한 회원 목록 (최근 발견순)
  @GetMapping("/{id}/discoveries")
  public List<SecretRecipeDiscoveryListResponseDto> getDiscoveries(@PathVariable Long id) {
    return secretRecipeService.getDiscoveries(id);
  }

  // 비밀 레시피 수정. id는 경로에서 받고, 본문의 값으로 덮어쓴다
  @PutMapping("/{id}")
  public SecretRecipeUpdatedResponseDto update(
      @PathVariable Long id, @Valid @RequestBody SecretRecipeUpdateRequestDto request) {
    return secretRecipeService.update(id, request);
  }

  // 비밀 레시피 삭제. 성공하면 본문 없이 204. 손님이 이미 발견한 레시피면 409 (숨김으로 바꾼다)
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    secretRecipeService.delete(id);
  }
}
