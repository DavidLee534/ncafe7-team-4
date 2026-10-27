package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.ingredient.IngredientCreateRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientCreatedResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientDetailResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientListRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientListResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientUpdateRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientUpdatedResponseDto;
import com.newcafe.backend.service.admin.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/ingredients")
@RequiredArgsConstructor
public class IngredientController {

  private final IngredientService ingredientService;

  // 재료 생성. 성공하면 201과 저장된 재료. 같은 이름이 있으면 409
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public IngredientCreatedResponseDto create(@Valid @RequestBody IngredientCreateRequestDto request) {
    return ingredientService.create(request);
  }

  // 재료 목록. 쿼리스트링의 조건(?type=&shelf=&keyword=)으로 거른다. 조건이 없으면 전체
  @GetMapping
  public List<IngredientListResponseDto> getList(@ModelAttribute IngredientListRequestDto request) {
    return ingredientService.getList(request);
  }

  // 재료 상세. 없는 id면 404
  @GetMapping("/{id}")
  public IngredientDetailResponseDto getDetail(@PathVariable Long id) {
    return ingredientService.getDetail(id);
  }

  // 재료 수정. id는 경로에서 받고, 본문의 값으로 덮어쓴다
  @PutMapping("/{id}")
  public IngredientUpdatedResponseDto update(@PathVariable Long id, @Valid @RequestBody IngredientUpdateRequestDto request) {
    return ingredientService.update(id, request);
  }

  // 재료 삭제. 성공하면 본문 없이 204
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    ingredientService.delete(id);
  }
}
