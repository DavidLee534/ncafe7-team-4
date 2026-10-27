package com.newcafe.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.dto.admin.order.OrderListRequestDto;
import com.newcafe.backend.dto.admin.order.OrderStatusRequestDto;
import com.newcafe.backend.dto.my.order.MyOrderStatusRequestDto;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.entity.Order;
import com.newcafe.backend.entity.OrderItem;
import com.newcafe.backend.repository.MemberRepository;
import com.newcafe.backend.repository.OrderRepository;
import com.newcafe.backend.service.admin.AdminMainService;
import com.newcafe.backend.service.admin.OrderService;
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
    "spring.datasource.url=jdbc:h2:mem:order_admin_it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.sql.init.mode=never"
})
@Transactional
class OrderAdminIntegrationTest {
  @Autowired private MemberRepository members;
  @Autowired private OrderRepository orders;
  @Autowired private MyPageService myPage;
  @Autowired private OrderService adminOrders;
  @Autowired private AdminMainService adminMain;

  @AfterEach
  void clearRequest() {
    RequestContextHolder.resetRequestAttributes();
  }

  @Test
  void customerOrderAppearsInAdminQueueAndCanBeProcessed() {
    Member member = members.save(Member.builder().email("order@example.test").password("test")
        .nickname("주문자").role("member").status("active").build());
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.getSession(true).setAttribute(CurrentMember.SESSION_KEY, member.getId());
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

    // 접수된 주문 하나 (주문 · 결제 API 는 CheckoutIntegrationTest 에서 본다)
    Order pending = Order.builder().member(member).orderNumber("NC-ADMIN-1").status("ordered")
        .pickupName("픽업").pickupType("takeout").build();
    pending.addItem(OrderItem.builder().itemType("menu").name("포션").unitPrice(4500).quantity(2).build());
    var created = myPage.getOrder(orders.saveAndFlush(pending).getId());

    assertEquals("ordered", created.status());
    assertEquals(1, adminOrders.getSummary().ordered());
    assertEquals(9000, adminOrders.getSummary().todayOrderAmount());
    assertEquals(created.id(), adminOrders.getList(new OrderListRequestDto("ordered", null, null, null)).getFirst().id());
    assertEquals(1, adminMain.getMain().orders().ordered());
    assertEquals(created.id(), adminMain.getMain().pendingOrders().getFirst().id());

    assertEquals("brewing", adminOrders.changeStatus(created.id(), new OrderStatusRequestDto("brewing")).status());
    assertEquals(0, adminOrders.getSummary().ordered());
    assertEquals(1, adminOrders.getSummary().brewing());
    assertFalse(adminMain.getMain().pendingOrders().stream().anyMatch(order -> order.id().equals(created.id())));
    assertThrows(IllegalStateException.class,
        () -> myPage.cancelOrder(created.id(), new MyOrderStatusRequestDto("cancelled")));
  }
}
