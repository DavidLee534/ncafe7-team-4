package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.secretrecipe.*;
import java.util.List;

public interface SecretRecipeService {
  List<SecretRecipeListResponseDto> getList();

  SecretRecipeDetailResponseDto create(SecretRecipeCreateRequestDto request);

  SecretRecipeDetailResponseDto getDetail(Long id);

  SecretRecipeDetailResponseDto update(Long id, SecretRecipeUpdateRequestDto request);

  void delete(Long id);
}
