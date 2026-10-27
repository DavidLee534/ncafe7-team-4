package com.newcafe.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import com.newcafe.backend.dto.showcase.PotionShowcaseCreateRequestDto;
import com.newcafe.backend.dto.showcase.ShowcaseRatingRequestDto;
import com.newcafe.backend.dto.showcase.ShowcaseCommentCreateRequestDto;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.entity.*;
import com.newcafe.backend.repository.*;
import com.newcafe.backend.service.my.MyPageService;
import com.newcafe.backend.dto.my.order.MyOrderStatusRequestDto;
import com.newcafe.backend.dto.my.order.OrderCreateRequestDto;
import com.newcafe.backend.dto.my.cart.CartItemCreateRequestDto;
import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.service.my.MyCartService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:showcase_it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.sql.init.mode=never"
})
@Transactional
class PotionShowcaseIntegrationTest {
  @Autowired private PotionShowcaseService service;
  @Autowired private ShowcaseCommentService commentService;
  @Autowired private ShowcaseCommentRepository commentRepository;
  @Autowired private MemberRepository members;
  @Autowired private CategoryRepository categories;
  @Autowired private MenuRepository menus;
  @Autowired private RecipeRepository recipes;
  @Autowired private PotionShowcaseRepository showcases;
  @Autowired private OrderRepository orders;
  @Autowired private MyPageService myPage;
  @Autowired private MyCartService myCart;

  @BeforeEach
  void loginTestMember() {
    var request = new MockHttpServletRequest();
    request.getSession(true).setAttribute(CurrentMember.SESSION_KEY, 1L);
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
  }

  @AfterEach
  void clearRequest() { RequestContextHolder.resetRequestAttributes(); }

  @Test
  void createsListsAndRatesAnotherMembersPost() {
    var me = members.save(Member.builder().email("mine@example.test").password("test")
        .nickname("나").role("member").status("active").build());
    assertEquals(1L, me.getId());
    var other = members.save(Member.builder().email("other@example.test").password("test")
        .nickname("다른 회원").role("member").status("active").build());
    var category = categories.save(Category.builder().name("커피").engName("Coffee").sortOrder(1).visible(true).build());
    var menu = menus.save(Menu.builder().korName("커피").engName("Coffee").price(4000)
        .category(category).status("on").build());
    var myRecipe = recipes.save(Recipe.builder().member(me).baseMenu(menu).name("내 포션")
        .grade("normal").price(4000).color("#123456").build());
    var otherRecipe = recipes.save(Recipe.builder().member(other).baseMenu(menu).name("다른 포션")
        .grade("rare").price(4500).color("#654321").build());

    var created = service.create(new PotionShowcaseCreateRequestDto(myRecipe.getId(), "내 글", "소개"));
    assertTrue(created.mine());
    assertEquals("내 글", service.getDetail(created.id()).title());

    var otherPost = showcases.save(PotionShowcase.builder().member(other).recipe(otherRecipe)
        .title("다른 글").content("내용").build());
    var rated = service.rate(otherPost.getId(), new ShowcaseRatingRequestDto(5));
    assertEquals(5.0, rated.averageScore());
    assertEquals(1L, rated.ratingCount());
    assertEquals(2, service.getList("rating", 10).size());
    assertEquals(otherPost.getId(), service.getList("rating", 10).get(0).id());

    var firstCartItem = myCart.add(new CartItemCreateRequestDto(null, otherRecipe.getId(), null));
    var repeatedCartItem = myCart.add(new CartItemCreateRequestDto(null, otherRecipe.getId(), 2));
    assertEquals(firstCartItem.id(), repeatedCartItem.id());
    assertEquals(3, repeatedCartItem.quantity());

    var paid = orders.save(Order.builder().member(me).orderNumber("NC-1").status("paid")
        .pickupName("나").pickupType("takeout").build());
    orders.save(Order.builder().member(me).orderNumber("NC-2").status("done")
        .pickupName("나").pickupType("dine-in").build());
    orders.save(Order.builder().member(me).orderNumber("NC-3").status("cancelled")
        .pickupName("나").pickupType("takeout").build());

    assertEquals(2, myPage.getMembership().orderCount());
    assertEquals(3, myPage.getOrderSummary().all());
    assertEquals(1, myPage.getOrderSummary().cancelled());
    assertEquals("cancelled", myPage.cancelOrder(paid.getId(), new MyOrderStatusRequestDto("cancelled")).status());
    assertThrows(IllegalStateException.class,
        () -> myPage.cancelOrder(paid.getId(), new MyOrderStatusRequestDto("cancelled")));
    assertEquals(1, myPage.getMembership().orderCount());

    var createdOrder = myPage.createOrder(new OrderCreateRequestDto("나", "takeout", "얼음 적게",
        java.util.List.of(new OrderCreateRequestDto.Item("내 포션", "얼음", 4500, 2))));
    assertEquals("ordered", createdOrder.status());
    assertEquals(9000, createdOrder.totalPrice());
    assertEquals(createdOrder.orderNumber(), myPage.getOrder(createdOrder.id()).orderNumber());
    assertEquals(4, myPage.getOrderSummary().all());
    assertEquals("cancelled", myPage.cancelOrder(createdOrder.id(), new MyOrderStatusRequestDto("cancelled")).status());

    var comment = commentService.create(created.id(), new ShowcaseCommentCreateRequestDto("첫 댓글", null));
    var reply = commentService.create(created.id(), new ShowcaseCommentCreateRequestDto("답글", comment.id()));
    assertEquals(comment.id(), reply.parentId());
    assertEquals(2, commentService.getList(created.id()).size());
    assertThrows(IllegalArgumentException.class, () -> commentService.create(created.id(),
        new ShowcaseCommentCreateRequestDto("세 단계", reply.id())));
    assertThrows(RuntimeException.class, () -> commentService.create(otherPost.getId(),
        new ShowcaseCommentCreateRequestDto("다른 글", comment.id())));

    var request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
    request.getSession().setAttribute(CurrentMember.SESSION_KEY, other.getId());
    assertThrows(ForbiddenException.class, () -> commentService.delete(created.id(), comment.id()));
    request.getSession().setAttribute(CurrentMember.SESSION_KEY, me.getId());
    commentService.delete(created.id(), comment.id());
    assertTrue(commentService.getList(created.id()).get(0).deleted());
    assertEquals("답글", commentService.getList(created.id()).get(1).content());
    service.delete(created.id());
    showcases.flush();
    assertEquals(0, commentRepository.findByShowcaseIdWithMember(created.id()).size());
  }
}
