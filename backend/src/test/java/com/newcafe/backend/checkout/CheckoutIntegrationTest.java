package com.newcafe.backend.checkout;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.dto.checkout.CartEntryRequest;
import com.newcafe.backend.dto.checkout.CheckoutRequest;
import com.newcafe.backend.service.checkout.CheckoutService;
import com.newcafe.backend.service.checkout.CartService;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.datasource.url=jdbc:h2:mem:checkout;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=false"
})
class CheckoutIntegrationTest {
    @Autowired CheckoutService checkout;
    @Autowired CartService carts;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean CurrentMember currentMember;
    @LocalServerPort int port;
    private Long menuId;
    private Long memberId;

    @BeforeEach
    void reset() {
        jdbc.update("delete from checkout_attempts");
        jdbc.update("delete from payments");
        jdbc.update("delete from order_items");
        jdbc.update("delete from orders");
        jdbc.update("delete from cart_items");
        memberId = jdbc.queryForObject("select id from members where email='moka@ncafe.dev'", Long.class);
        menuId = jdbc.queryForObject("select id from menus where slug='dark-roast-coffee'", Long.class);
        jdbc.update("update menus set price=4000, status='on' where id=?", menuId);
        when(currentMember.id()).thenReturn(memberId);
    }

    private CheckoutRequest request(String version) {
        return new CheckoutRequest("모카손님", "takeout", "얼음 적게", "card", "모의카드", version);
    }


    @Test
    void serverPriceSnapshotAndIdempotency() {
        carts.add(new CartEntryRequest(menuId, null, 2));
        var request = request(carts.cart().version());
        String key = UUID.randomUUID().toString();
        var receipt = checkout.checkout(key, request);
        assertThat(receipt.totalPrice()).isEqualTo(8000);
        assertThat(receipt.payment().amount()).isEqualTo(8000);
        assertThat(receipt.status()).isEqualTo("paid");
        assertThat(carts.cart().items()).isEmpty();
        assertThat(checkout.checkout(key, request).id()).isEqualTo(receipt.id());
        assertThat(jdbc.queryForObject("select count(*) from orders", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from payments", Integer.class)).isEqualTo(1);
        jdbc.update("update menus set price=9000 where id=?", menuId);
        assertThat(checkout.receipt(receipt.id()).items().getFirst().unitPrice()).isEqualTo(4000);
        carts.add(new CartEntryRequest(menuId, null, 1));
        assertThatThrownBy(() -> checkout.checkout(key, request(carts.cart().version())))
            .isInstanceOf(IllegalStateException.class);
        assertThat(carts.cart().items()).hasSize(1);
    }

    @Test
    void stalePriceOrQuantityCannotBePaid() {
        carts.add(new CartEntryRequest(menuId, null, 1));
        var oldRequest = request(carts.cart().version());
        jdbc.update("update menus set price=5000 where id=?", menuId);
        assertThatThrownBy(() -> checkout.checkout(UUID.randomUUID().toString(), oldRequest))
            .hasMessageContaining("바뀌었습니다");
        assertThat(jdbc.queryForObject("select count(*) from orders", Integer.class)).isZero();
        assertThat(carts.cart().items()).hasSize(1);
    }

    @Test
    void soldOutCartAndEmptyCartCannotBePaid() {
        assertThatThrownBy(() -> checkout.checkout(UUID.randomUUID().toString(), request(carts.cart().version())))
            .hasMessageContaining("비어");
        carts.add(new CartEntryRequest(menuId, null, 1));
        jdbc.update("update menus set status='soldout' where id=?", menuId);
        assertThatThrownBy(() -> carts.add(new CartEntryRequest(menuId, null, 1)))
            .hasMessageContaining("판매");
        assertThatThrownBy(() -> checkout.checkout(UUID.randomUUID().toString(), request(carts.cart().version())))
            .hasMessageContaining("품절");
        assertThat(carts.cart().items()).hasSize(1);
    }

    @Test
    void anotherMembersRecipeAndReceiptAreNotExposed() {
        Long recipeId = jdbc.queryForObject("select r.id from recipes r join members m on r.member_id=m.id where m.email='cheese@ncafe.dev' fetch first 1 row only", Long.class);
        assertThatThrownBy(() -> carts.add(new CartEntryRequest(null, recipeId, 1)))
            .hasMessageContaining("내 레시피");
        carts.add(new CartEntryRequest(menuId, null, 1));
        var receipt = checkout.checkout(UUID.randomUUID().toString(), request(carts.cart().version()));
        Long other = jdbc.queryForObject("select id from members where email='cheese@ncafe.dev'", Long.class);
        when(currentMember.id()).thenReturn(other);
        assertThatThrownBy(() -> checkout.receipt(receipt.id())).hasMessageContaining("찾을 수");
    }

    @Test
    void concurrentRetriesCreateOnlyOneOrder() throws Exception {
        carts.add(new CartEntryRequest(menuId, null, 1));
        var request = request(carts.cart().version());
        String key = UUID.randomUUID().toString();
        try (var executor = Executors.newFixedThreadPool(2)) {
            Callable<Long> task = () -> checkout.checkout(key, request).id();
            var results = executor.invokeAll(List.of(task, task));
            assertThat(results.get(0).get()).isEqualTo(results.get(1).get());
        }
        assertThat(jdbc.queryForObject("select count(*) from orders", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from payments", Integer.class)).isEqualTo(1);
    }

    @Test
    void paymentFailureRollsBackOrderAndPreservesCart() {
        carts.add(new CartEntryRequest(menuId, null, 2));
        jdbc.execute("alter table payments add constraint test_reject_payment check (amount < 0)");
        try {
            assertThatThrownBy(() -> checkout.checkout(UUID.randomUUID().toString(), request(carts.cart().version())))
                .isInstanceOf(RuntimeException.class);
            assertThat(jdbc.queryForObject("select count(*) from orders", Integer.class)).isZero();
            assertThat(jdbc.queryForObject("select count(*) from checkout_attempts", Integer.class)).isZero();
            assertThat(carts.cart().totalQuantity()).isEqualTo(2);
        } finally {
            jdbc.execute("alter table payments drop constraint test_reject_payment");
        }
    }


    private HttpClient authenticatedClient() throws Exception {
        var client = HttpClient.newBuilder().cookieHandler(new java.net.CookieManager()).build();
        var login = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/v1/auth/login"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"email\":\"moka@ncafe.dev\",\"password\":\"ncafe1234\"}")).build(),
            HttpResponse.BodyHandlers.ofString());
        // develop에는 인증 API가 없고 PR #19 병합 후에는 실제 세션으로 검증한다.
        assertThat(login.statusCode()).isIn(200, 404);
        return client;
    }


    @Test
    void orderApiValidatesInputAndIgnoresClientPrices() throws Exception {
        carts.add(new CartEntryRequest(menuId, null, 2));
        String body = "{\"pickupName\":\"모카\",\"pickupType\":\"takeout\",\"request\":\"\",\"payMethod\":\"card\",\"payDetail\":\"테스트\",\"cartVersion\":\""
            + carts.cart().version() + "\",\"totalPrice\":1,\"unitPrice\":1}";
        String key = UUID.randomUUID().toString();
        try (var client = authenticatedClient()) {
            var invalid = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/v1/orders"))
                .header("Content-Type", "application/json").header("Idempotency-Key", key)
                .POST(HttpRequest.BodyPublishers.ofString(body.replace("\"card\"", "\"invalid\""))).build(),
                HttpResponse.BodyHandlers.ofString());
            assertThat(invalid.statusCode()).isEqualTo(400);
            var request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/v1/orders"))
                .header("Content-Type", "application/json").header("Idempotency-Key", key)
                .POST(HttpRequest.BodyPublishers.ofString(body)).build();
            var first = client.send(request, HttpResponse.BodyHandlers.ofString());
            var retry = client.send(request, HttpResponse.BodyHandlers.ofString());
            assertThat(first.statusCode()).isEqualTo(201);
            assertThat(first.body()).contains("\"totalPrice\":8000");
            assertThat(retry.statusCode()).isEqualTo(201);
            assertThat(retry.body()).isEqualTo(first.body());
            assertThat(jdbc.queryForObject("select count(*) from payments", Integer.class)).isEqualTo(1);
        }
    }
}
