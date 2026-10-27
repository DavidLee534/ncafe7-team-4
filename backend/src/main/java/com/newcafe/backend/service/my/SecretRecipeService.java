package com.newcafe.backend.service.my;

import com.newcafe.backend.dto.my.secretrecipe.MySecretRecipeDetailResponseDto;
import com.newcafe.backend.dto.my.secretrecipe.MySecretRecipeListResponseDto;
import java.util.List;

// 회원 도감 · 비밀 레시피 탭. 구현체는 DfSecretRecipeService(빈 이름 mySecretRecipeService)
// 관리자 쪽(service/admin/SecretRecipeService)과 이름이 같지만 패키지가 달라 다른 타입이다
public interface SecretRecipeService {

  List<MySecretRecipeListResponseDto> getList();

  MySecretRecipeDetailResponseDto getDetail(Long id);
}
