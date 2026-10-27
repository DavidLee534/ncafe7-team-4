package com.newcafe.backend.controller;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.auth.PasswordHasher;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.common.exception.UnauthorizedException;
import com.newcafe.backend.dto.my.account.*;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
  private final MemberRepository members;
  private final PasswordHasher passwords;
  private final CurrentMember currentMember;

  @PostMapping("/signup")
  @ResponseStatus(HttpStatus.CREATED)
  @Transactional
  public AccountResponseDto signup(@Valid @RequestBody SignUpRequestDto request) {
    String email = request.email().trim().toLowerCase(Locale.ROOT);
    if (members.existsByEmailIgnoreCase(email)) throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
    var member = members.save(Member.builder().email(email).password(passwords.hash(request.password()))
        .nickname(request.nickname().trim()).role("member").status("active").build());
    return response(member);
  }

  @PostMapping("/login")
  public AccountResponseDto login(@Valid @RequestBody LoginRequestDto request, HttpServletRequest http) {
    var member = members.findByEmailIgnoreCase(request.email().trim())
        .orElseThrow(() -> new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다."));
    if (!passwords.matches(request.password(), member.getPassword()))
      throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
    if (!"active".equals(member.getStatus())) throw new ForbiddenException("활성 회원만 이용할 수 있습니다.");
    http.getSession(true).invalidate();
    http.getSession(true).setAttribute(CurrentMember.SESSION_KEY, member.getId());
    return response(member);
  }

  @GetMapping("/me")
  public AccountResponseDto me() {
    var member = members.findById(currentMember.id())
        .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));
    if (!"active".equals(member.getStatus())) throw new ForbiddenException("활성 회원만 이용할 수 있습니다.");
    return response(member);
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(HttpServletRequest http) {
    var session = http.getSession(false);
    if (session != null) session.invalidate();
  }

  private AccountResponseDto response(Member member) {
    return new AccountResponseDto(member.getEmail(), member.getNickname(), member.getCreatedAt());
  }
}
