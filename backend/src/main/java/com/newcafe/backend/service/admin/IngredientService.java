package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.ingredient.IngredientCreateRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientCreatedResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientDetailResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientListRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientListResponseDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientUpdateRequestDto;
import com.newcafe.backend.dto.admin.ingredient.IngredientUpdatedResponseDto;

import java.util.List;

// 관리자 재료 관리 업무. 구현체는 DfIngredientService
// 컨트롤러와는 DTO로만 주고받고, 엔티티는 서비스 안에서만 다룬다
public interface IngredientService {

  IngredientCreatedResponseDto create(IngredientCreateRequestDto request);

  List<IngredientListResponseDto> getList(IngredientListRequestDto request);

  IngredientDetailResponseDto getDetail(Long id);

  IngredientUpdatedResponseDto update(Long id, IngredientUpdateRequestDto request);

  void delete(Long id);
}
