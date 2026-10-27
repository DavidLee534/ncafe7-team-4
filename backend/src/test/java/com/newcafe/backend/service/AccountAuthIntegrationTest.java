package com.newcafe.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.controller.AuthController;
import com.newcafe.backend.dto.my.account.*;
import com.newcafe.backend.service.my.MyPageService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:auth_it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.sql.init.mode=never"
})
@Transactional
class AccountAuthIntegrationTest {
  @Autowired private AuthController auth;
  @Autowired private MyPageService myPage;

  @AfterEach
  void clearRequest() { RequestContextHolder.resetRequestAttributes(); }

  @Test
  void signupLoginAndChangeEmailAndPassword() {
    var request = new MockHttpServletRequest();
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    auth.signup(new SignUpRequestDto("member@example.test", "first-secret-123", "처음"));
    assertThrows(RuntimeException.class, () -> auth.login(new LoginRequestDto("member@example.test", "wrong"), request));
    auth.login(new LoginRequestDto("member@example.test", "first-secret-123"), request);
    assertNotNull(request.getSession(false).getAttribute(CurrentMember.SESSION_KEY));
    assertEquals("처음", myPage.getAccount().nickname());
    assertThrows(RuntimeException.class, () -> myPage.updateAccount(new AccountUpdateRequestDto(
        "변경", "new@example.test", "wrong", "next-secret-456")));
    var changed = myPage.updateAccount(new AccountUpdateRequestDto(
        "변경", "new@example.test", "first-secret-123", "next-secret-456"));
    assertEquals("new@example.test", changed.email());
    assertEquals("변경", changed.nickname());
    auth.logout(request);
    assertThrows(RuntimeException.class, myPage::getAccount);
    assertThrows(RuntimeException.class, () -> auth.login(new LoginRequestDto("member@example.test", "first-secret-123"), request));
    auth.login(new LoginRequestDto("new@example.test", "next-secret-456"), request);
    assertEquals("new@example.test", myPage.getAccount().email());
  }
}
