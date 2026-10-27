package com.newcafe.backend.controller;

import com.newcafe.backend.dto.auth.LoginRequestDto;
import com.newcafe.backend.dto.auth.LoginResponseDto;
import com.newcafe.backend.dto.auth.SignupRequestDto;
import com.newcafe.backend.dto.auth.SignupResponseDto;
import com.newcafe.backend.service.AuthService;
import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.common.exception.UnauthorizedException;
import com.newcafe.backend.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

// WBS 2.0 인증 시스템: 회원가입 · 로그인 · 로그아웃
// 로그아웃(POST /api/v1/auth/logout)은 SecurityConfig 의 logout 설정이 처리한다
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final CurrentMember currentMember;
  private final MemberRepository members;
  private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

  // 회원가입. 성공하면 201. 이메일이 이미 있으면 409. 가입만 하고 로그인은 따로 한다
  @PostMapping("/signup")
  @ResponseStatus(HttpStatus.CREATED)
  public SignupResponseDto signup(@Valid @RequestBody SignupRequestDto request) {
    return authService.signup(request);
  }

  // 로그인. 성공하면 세션에 "회원 id + 권한(ROLE_member / ROLE_admin)"을 저장하고, 응답에 JSESSIONID 쿠키가 실린다
  // 틀리면 401, 정지 회원이면 401
  @PostMapping("/login")
  public LoginResponseDto login(@Valid @RequestBody LoginRequestDto request,
                                HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
    LoginResponseDto member = authService.login(request);

    // 로그인 전 세션은 버리고 새로 만든다 (세션 고정 공격 방지)
    HttpSession oldSession = httpRequest.getSession(false);
    if (oldSession != null) oldSession.invalidate();

    // principal 에 회원 id 를 넣는다 → CurrentMember.id() 가 꺼내 쓴다
    var authentication = UsernamePasswordAuthenticationToken.authenticated(
        member.id(), null, List.of(new SimpleGrantedAuthority("ROLE_" + member.role())));
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);
    securityContextRepository.saveContext(context, httpRequest, httpResponse);
    httpRequest.getSession().setAttribute(CurrentMember.SESSION_KEY, member.id());
    return member;
  }

  @GetMapping("/me")
  public LoginResponseDto me() {
    var member = members.findById(currentMember.id())
        .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));
    if (!"active".equals(member.getStatus())) throw new ForbiddenException("활성 회원만 이용할 수 있습니다.");
    return LoginResponseDto.from(member);
  }
}
