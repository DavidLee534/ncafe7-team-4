package com.newcafe.backend.common.auth;

import com.newcafe.backend.common.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class CurrentMember {
  public static final String SESSION_KEY = "memberId";

  public Long id() {
    var attributes = RequestContextHolder.getRequestAttributes();
    if (!(attributes instanceof ServletRequestAttributes servlet))
      throw new UnauthorizedException("로그인이 필요합니다.");
    HttpServletRequest request = servlet.getRequest();
    HttpSession session = request.getSession(false);
    if (session == null || !(session.getAttribute(SESSION_KEY) instanceof Long id))
      throw new UnauthorizedException("로그인이 필요합니다.");
    return id;
  }
}
