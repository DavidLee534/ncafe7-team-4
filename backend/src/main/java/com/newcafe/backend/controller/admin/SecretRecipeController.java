package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.secretrecipe.*;
import com.newcafe.backend.service.admin.SecretRecipeService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/secret-recipes")
@RequiredArgsConstructor
public class SecretRecipeController {

  private final SecretRecipeService recipeService;

  @GetMapping
  public List<SecretRecipeListResponseDto> getList() {
    return recipeService.getList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public SecretRecipeDetailResponseDto create(@Valid @RequestBody SecretRecipeCreateRequestDto request) {
    return recipeService.create(request);
  }

  @GetMapping("/{id}")
  public SecretRecipeDetailResponseDto getDetail(@PathVariable Long id) {
    return recipeService.getDetail(id);
  }

  @PutMapping("/{id}")
  public SecretRecipeDetailResponseDto update(@PathVariable Long id,
                                               @Valid @RequestBody SecretRecipeUpdateRequestDto request) {
    return recipeService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    recipeService.delete(id);
  }
}
