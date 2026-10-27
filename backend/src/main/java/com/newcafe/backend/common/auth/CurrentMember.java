package com.newcafe.backend.common.auth;

import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

// "지금 요청한 회원"의 id 를 꺼내는 곳. 회원 기능(/api/v1/my/..., 장바구니, 주문, 포션 자랑)은 모두 여기서 받는다
// 로그인할 때 AuthController 가 세션에 넣어 둔 회원 id 를 꺼낸다
// 로그인하지 않았으면 401 (GlobalExceptionHandler)
//
// 사용 예 (서비스에서 주입받아 쓴다)
//   private final CurrentMember currentMember;
//   Long memberId = currentMember.id();
@Component
public class CurrentMember {
  public static final String SESSION_KEY = "memberId";

  public Long id() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    // 로그인하지 않은 요청은 principal 이 "anonymousUser" 문자열이다
    if (authentication != null && authentication.getPrincipal() instanceof Long memberId) {
      return memberId;
    }
    if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes) {
      HttpSession session = attributes.getRequest().getSession(false);
      if (session != null && session.getAttribute(SESSION_KEY) instanceof Long memberId) return memberId;
    }
    throw new AuthenticationCredentialsNotFoundException("로그인이 필요합니다.");
  }
}
