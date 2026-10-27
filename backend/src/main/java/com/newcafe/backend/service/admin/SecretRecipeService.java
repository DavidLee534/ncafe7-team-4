package com.newcafe.backend.service.admin;

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

import java.util.List;

// 관리자 비밀 레시피 관리 업무. 구현체는 DfSecretRecipeService
// 컨트롤러와는 DTO로만 주고받고, 엔티티는 서비스 안에서만 다룬다
public interface SecretRecipeService {

  SecretRecipeCreatedResponseDto create(SecretRecipeCreateRequestDto request);

  List<SecretRecipeListResponseDto> getList(SecretRecipeListRequestDto request);

  SecretRecipeDetailResponseDto getDetail(Long id);

  SecretRecipeSummaryResponseDto getSummary();

  List<SecretRecipeCategoryListResponseDto> getCategories();

  List<SecretRecipeDiscoveryListResponseDto> getDiscoveries(Long id);

  SecretRecipeUpdatedResponseDto update(Long id, SecretRecipeUpdateRequestDto request);

  void delete(Long id);
}
