package com.newcafe.backend.dto.admin.secretrecipe;

// 비밀 레시피 요청 DTO 들이 같이 쓰는 검증 규칙
final class SecretRecipeRules {

  // 등급: rare(희귀) / legend(전설)
  static final String GRADE = "rare|legend";

  // 포션 색: #RRGGBB (재료 DTO 와 같은 규칙)
  static final String COLOR = "^#[0-9A-Fa-f]{6}$";

  private SecretRecipeRules() {
  }
}
