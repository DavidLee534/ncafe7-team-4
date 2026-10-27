package com.newcafe.backend.checkout;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.dto.checkout.CartEntryRequest;
import com.newcafe.backend.service.checkout.CartService;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
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
class CartIntegrationTest {
    @Autowired CartService checkout;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean CurrentMember currentMember;
    @LocalServerPort int port;
    private Long menuId;
    private Long memberId;

    @BeforeEach
    void reset() {
        jdbc.update("delete from cart_items");
        memberId = jdbc.queryForObject("select id from members where email='moka@ncafe.dev'", Long.class);
        menuId = jdbc.queryForObject("select id from menus where slug='dark-roast-coffee'", Long.class);
        jdbc.update("update menus set price=4000, status='on' where id=?", menuId);
        when(currentMember.id()).thenReturn(memberId);
    }

    @Test
    void cartMergesAndEnforcesQuantityAndOwnership() {
        var first = checkout.add(new CartEntryRequest(menuId, null, 2));
        var merged = checkout.add(new CartEntryRequest(menuId, null, 3));
        assertThat(merged.id()).isEqualTo(first.id());
        assertThat(checkout.cart().totalQuantity()).isEqualTo(5);
        assertThatThrownBy(() -> checkout.add(new CartEntryRequest(menuId, null, 20)))
            .isInstanceOf(IllegalArgumentException.class);
        assertThat(checkout.cart().totalQuantity()).isEqualTo(5);
        assertThat(checkout.changeQuantity(first.id(), 1).quantity()).isEqualTo(1);
        Long other = jdbc.queryForObject("select id from members where email='cheese@ncafe.dev'", Long.class);
        when(currentMember.id()).thenReturn(other);
        assertThatThrownBy(() -> checkout.changeQuantity(first.id(), 2)).hasMessageContaining("찾을 수");
        assertThatThrownBy(() -> checkout.remove(first.id())).hasMessageContaining("찾을 수");
        when(currentMember.id()).thenReturn(memberId);
        checkout.remove(first.id());
        assertThat(checkout.cart().items()).isEmpty();
    }

    @Test
    void suspendedMemberCannotReadOrChangeCart() {
        Long suspended = jdbc.queryForObject("select id from members where email='tofu@ncafe.dev'", Long.class);
        when(currentMember.id()).thenReturn(suspended);
        assertThatThrownBy(() -> checkout.cart()).hasMessageContaining("활성 회원");
        assertThatThrownBy(() -> checkout.add(new CartEntryRequest(menuId, null, 1))).hasMessageContaining("활성 회원");
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
    void apiValidationRejectsInvalidProductsAndQuantities() throws Exception {
        try (var client = authenticatedClient()) {
            for (String body : List.of("{}", "{\"menuId\":1,\"recipeId\":1}", "{\"menuId\":1,\"quantity\":0}", "{\"menuId\":1,\"quantity\":21}", "{\"menuId\":1,\"quantity\":1.5}")) {
                var response = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/v1/my/cart/items"))
                    .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(body)).build(),
                    HttpResponse.BodyHandlers.ofString());
                assertThat(response.statusCode()).as(body).isEqualTo(400);
            }
        }
    }
    @Test
    void catalogContainsOnlyOwnRecipesAndCartAcceptsOwnOrShowcasedRecipe() {
        Long ownRecipe = jdbc.queryForObject("select r.id from recipes r where r.member_id=? fetch first 1 row only", Long.class, memberId);
        // 치즈손님의 '잠드는 꼬리'는 자랑글에 올라와 있다
        Long showcasedRecipe = jdbc.queryForObject("select s.recipe_id from potion_showcases s join members m on s.member_id=m.id where m.email='cheese@ncafe.dev' fetch first 1 row only", Long.class);
        Long cheese = jdbc.queryForObject("select id from members where email='cheese@ncafe.dev'", Long.class);
        jdbc.update("insert into recipes (member_id, base_menu_id, name, grade, price, color, created_at) values (?, ?, '숨겨 둔 포션', 'normal', 4000, '#000000', current_timestamp)", cheese, menuId);
        Long hiddenRecipe = jdbc.queryForObject("select id from recipes where name='숨겨 둔 포션'", Long.class);
        try {
            assertThat(checkout.catalog()).anyMatch(item -> ownRecipe.equals(item.recipeId()))
                .noneMatch(item -> showcasedRecipe.equals(item.recipeId()));
            assertThat(checkout.add(new CartEntryRequest(null, ownRecipe, 1)).itemType()).isEqualTo("recipe");
            assertThat(checkout.add(new CartEntryRequest(null, showcasedRecipe, 1)).itemType()).isEqualTo("recipe");
            assertThatThrownBy(() -> checkout.add(new CartEntryRequest(null, hiddenRecipe, 1))).hasMessageContaining("자랑글");
        } finally {
            jdbc.update("delete from cart_items where recipe_id=?", hiddenRecipe);
            jdbc.update("delete from recipes where id=?", hiddenRecipe);
        }
    }

    @Test
    void hiddenCategoryCannotBeAdded() {
        Long category = jdbc.queryForObject("select category_id from menus where id=?", Long.class, menuId);
        jdbc.update("update categories set visible=false where id=?", category);
        try {
            assertThat(checkout.catalog()).noneMatch(item -> menuId.equals(item.menuId()));
            assertThatThrownBy(() -> checkout.add(new CartEntryRequest(menuId, null, 1))).hasMessageContaining("판매");
        } finally {
            jdbc.update("update categories set visible=true where id=?", category);
        }
    }
}
