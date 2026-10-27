package com.newcafe.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.CookieManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

// 인증 흐름 전체를 실제 서버(H2 + data.sql 시작 데이터)에 요청해서 확인한다
// 브라우저처럼 CookieManager 가 JSESSIONID 쿠키를 들고 다닌다
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.datasource.url=jdbc:h2:mem:authtest",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password="
})
class AuthFlowTests {

  // 로그인이 필요한 회원 API. 아직 컨트롤러가 없어서 로그인하면 404, 안 하면 401
  static final String MY_API = "/api/v1/my/cart/items";

  @Value("${local.server.port}")
  int port;

  @Test
  void loginSessionRolesAndLogout() throws Exception {
    HttpClient browser = HttpClient.newBuilder().cookieHandler(new CookieManager()).build();

    // 로그인 전: 회원 API 401
    assertEquals(401, send(browser, "GET", MY_API, null).statusCode());

    // 틀린 비밀번호, 정지 회원 → 401
    assertEquals(401, login(browser, "moka@ncafe.dev", "wrong-password").statusCode());
    assertEquals(401, login(browser, "tofu@ncafe.dev", "ncafe1234").statusCode());

    // 일반 회원 로그인 → 세션 유지, 관리자 API 는 403
    HttpResponse<String> ok = login(browser, "moka@ncafe.dev", "ncafe1234");
    assertEquals(200, ok.statusCode());
    assertTrue(!ok.body().contains("password"), "응답에 비밀번호가 없어야 한다");
    assertTrue(ok.body().contains("moka@ncafe.dev"));
    assertTrue(send(browser, "GET", MY_API, null).statusCode() != 401, "로그인 후에는 회원 API 를 통과해야 한다");
    assertEquals(403, send(browser, "GET", "/api/v1/admin/categories", null).statusCode());

    // 로그아웃 → 다시 401
    assertEquals(204, send(browser, "POST", "/api/v1/auth/logout", null).statusCode());
    assertEquals(401, send(browser, "GET", MY_API, null).statusCode());

    // 관리자 로그인 → 관리자 API 200
    assertEquals(200, login(browser, "admin@ncafe.dev", "ncafe1234").statusCode());
    assertEquals(200, send(browser, "GET", "/api/v1/admin/categories", null).statusCode());

    // 조회 API 는 로그인 없이도 열려 있다
    HttpClient guest = HttpClient.newHttpClient();
    assertTrue(send(guest, "GET", "/api/v1/menus", null).statusCode() != 401);
  }

  @Test
  void signup() throws Exception {
    HttpClient browser = HttpClient.newBuilder().cookieHandler(new CookieManager()).build();
    String body = "{\"email\":\"new@ncafe.dev\",\"password\":\"newpass1234\",\"nickname\":\"새손님\"}";

    HttpResponse<String> created = send(browser, "POST", "/api/v1/auth/signup", body);
    assertEquals(201, created.statusCode());
    assertTrue(created.body().contains("\"role\":\"member\""));
    assertEquals(409, send(browser, "POST", "/api/v1/auth/signup", body).statusCode());
    assertEquals(400, send(browser, "POST", "/api/v1/auth/signup",
        "{\"email\":\"bad\",\"password\":\"short\",\"nickname\":\"x\"}").statusCode());

    // 가입한 계정으로 로그인
    assertEquals(200, login(browser, "new@ncafe.dev", "newpass1234").statusCode());
  }

  private HttpResponse<String> login(HttpClient client, String email, String password) throws Exception {
    return send(client, "POST", "/api/v1/auth/login",
        "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}");
  }

  private HttpResponse<String> send(HttpClient client, String method, String path, String json) throws Exception {
    HttpRequest.Builder request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
        .header("Content-Type", "application/json")
        .method(method, json == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(json));
    return client.send(request.build(), HttpResponse.BodyHandlers.ofString());
  }
}
