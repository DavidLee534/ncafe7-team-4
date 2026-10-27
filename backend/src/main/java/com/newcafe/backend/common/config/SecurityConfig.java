package com.newcafe.backend.common.config;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

// 인증(누구인가)·인가(무엇을 할 수 있나) 설정. 세션(쿠키) 방식
// 로그인은 AuthController 가 세션에 저장하고, 이후 요청은 JSESSIONID 쿠키로 같은 회원임을 안다
@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // 세션 쿠키를 SameSite=Lax 로 보내서(application.yml) 다른 사이트의 요청에는 쿠키가 실리지 않는다
        .csrf(AbstractHttpConfigurer::disable)
        // 스프링 기본 로그인 화면·팝업은 쓰지 않는다 (프론트 /login 화면 + JSON API)
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        // 위에서부터 차례로 맞춰 보고, 처음 맞는 규칙을 쓴다
        .authorizeHttpRequests(auth -> auth
            // 404·500 같은 에러는 스프링이 /error 로 다시 보낸다. 막으면 비로그인 사용자에게 모든 에러가 401 로 보인다
            .requestMatchers("/error", "/api/v1/auth/**").permitAll()
            .requestMatchers("/api/v1/admin/**").hasRole("admin")   // 인가: 관리자만 (아니면 403)
            .requestMatchers("/api/v1/my/**").authenticated()        // 로그인 필요 (아니면 401)
            .requestMatchers(HttpMethod.GET, "/api/v1/**").permitAll() // 메뉴·포션 자랑 등 조회는 누구나
            .anyRequest().authenticated())                           // 나머지 쓰기(주문, 레시피, 포션 자랑, 별점)는 로그인 필요
        // 실패 응답도 다른 API 처럼 {"message": "..."} 로
        .exceptionHandling(e -> e
            .authenticationEntryPoint((req, res, ex) -> writeMessage(res, HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."))
            .accessDeniedHandler((req, res, ex) -> writeMessage(res, HttpStatus.FORBIDDEN, "권한이 없습니다.")))
        // POST /api/v1/auth/logout → 세션을 지우고 본문 없이 204
        .logout(logout -> logout
            .logoutUrl("/api/v1/auth/logout")
            .deleteCookies("JSESSIONID")
            .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT)));
    return http.build();
  }

  // 비밀번호 해시. 회원가입(encode)과 로그인(matches)에서 쓴다
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  private static void writeMessage(HttpServletResponse res, HttpStatus status, String message) throws IOException {
    res.setStatus(status.value());
    res.setContentType("application/json;charset=UTF-8");
    res.getWriter().write("{\"message\":\"" + message + "\"}");
  }
}
