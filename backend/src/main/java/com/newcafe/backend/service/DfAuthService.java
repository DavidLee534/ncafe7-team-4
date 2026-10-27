package com.newcafe.backend.service;

import com.newcafe.backend.dto.auth.LoginRequestDto;
import com.newcafe.backend.dto.auth.LoginResponseDto;
import com.newcafe.backend.dto.auth.SignupRequestDto;
import com.newcafe.backend.dto.auth.SignupResponseDto;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfAuthService implements AuthService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;

  // 같은 이메일이 있으면 409. 비밀번호는 BCrypt 해시로 바꿔 저장한다
  @Override
  @Transactional
  public SignupResponseDto signup(SignupRequestDto request) {
    if (memberRepository.existsByEmail(request.email())) {
      throw new IllegalStateException("이미 가입된 이메일입니다.");
    }
    Member saved = memberRepository.save(request.toEntity(passwordEncoder.encode(request.password())));
    return SignupResponseDto.from(saved);
  }

  // 이메일이 없을 때와 비밀번호가 틀릴 때 같은 메시지를 쓴다 (어느 이메일이 가입됐는지 알려주지 않으려고)
  // 실패하면 401 (GlobalExceptionHandler)
  @Override
  public LoginResponseDto login(LoginRequestDto request) {
    Member member = memberRepository.findByEmail(request.email())
        .filter(m -> passwordEncoder.matches(request.password(), m.getPassword()))
        .orElseThrow(() -> new BadCredentialsException("이메일 또는 비밀번호가 맞지 않습니다."));
    if ("suspended".equals(member.getStatus())) {
      throw new DisabledException("정지된 계정입니다. 관리자에게 문의하세요.");
    }
    return LoginResponseDto.from(member);
  }
}
