package com.newcafe.backend.service;

import com.newcafe.backend.dto.auth.LoginRequestDto;
import com.newcafe.backend.dto.auth.LoginResponseDto;
import com.newcafe.backend.dto.auth.SignupRequestDto;
import com.newcafe.backend.dto.auth.SignupResponseDto;

// 회원가입 · 로그인 확인 업무. 구현체는 DfAuthService
// 세션에 로그인 정보를 저장하는 일(HTTP)은 컨트롤러가 맡는다
public interface AuthService {

  SignupResponseDto signup(SignupRequestDto request);

  // 이메일·비밀번호가 맞고 정지 회원이 아니면 회원 정보를 돌려준다
  LoginResponseDto login(LoginRequestDto request);
}
