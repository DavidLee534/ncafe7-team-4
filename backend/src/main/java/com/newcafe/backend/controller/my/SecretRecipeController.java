package com.newcafe.backend.controller.my;

import com.newcafe.backend.dto.my.secretrecipe.MySecretRecipeDetailResponseDto;
import com.newcafe.backend.dto.my.secretrecipe.MySecretRecipeListResponseDto;
import com.newcafe.backend.service.my.SecretRecipeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 회원 도감 · 비밀 레시피 탭. 관리자 SecretRecipeController 와 이름이 같아서 빈 이름을 붙인다
@RestController("mySecretRecipeController")
@RequestMapping("/api/v1/my/secret-recipes")
@RequiredArgsConstructor
public class SecretRecipeController {

  private final SecretRecipeService secretRecipeService;

  // 손님에게 보이는 비밀 레시피 전체 + 내가 찾았는지. 못 찾은 레시피는 이름·설명 없이 수수께끼만
  @GetMapping
  public List<MySecretRecipeListResponseDto> getList() {
    return secretRecipeService.getList();
  }

  // 비밀 레시피 상세 + 이 레시피를 찾은 회원 비율. 숨김·없는 레시피면 404
  @GetMapping("/{id}")
  public MySecretRecipeDetailResponseDto getDetail(@PathVariable Long id) {
    return secretRecipeService.getDetail(id);
  }
}
