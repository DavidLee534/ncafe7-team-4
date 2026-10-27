package com.newcafe.backend.service.my;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.auth.PasswordHasher;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.dto.my.account.*;
import com.newcafe.backend.dto.my.order.*;
import com.newcafe.backend.dto.my.recipe.*;
import com.newcafe.backend.dto.my.showcase.*;
import com.newcafe.backend.entity.*;
import com.newcafe.backend.repository.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfMyPageService implements MyPageService {
  private final CurrentMember currentMember;
  private final PasswordHasher passwords;
  private final MemberRepository members;
  private final OrderRepository orders;
  private final PaymentRepository payments;
  private final PotionShowcaseRepository showcases;
  private final ShowcaseRatingRepository ratings;
  private final RecipeRepository recipes;

  private Member member() {
    var member = members.findById(currentMember.id()).orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다: " + currentMember.id()));
    if (!"active".equals(member.getStatus())) throw new ForbiddenException("활성 회원만 이용할 수 있습니다.");
    return member;
  }

  public AccountResponseDto getAccount() { return account(member()); }

  @Transactional
  public AccountResponseDto updateAccount(AccountUpdateRequestDto request) {
    var member = member();
    String email = request.email().trim().toLowerCase(Locale.ROOT);
    boolean emailChanged = !member.getEmail().equalsIgnoreCase(email);
    boolean passwordChanged = request.newPassword() != null && !request.newPassword().isBlank();
    if (emailChanged || passwordChanged) {
      if (request.currentPassword() == null || !passwords.matches(request.currentPassword(), member.getPassword()))
        throw new ForbiddenException("현재 비밀번호가 올바르지 않습니다.");
    }
    if (emailChanged && members.existsByEmailIgnoreCase(email))
      throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
    member.updateAccount(request.nickname().trim(), email);
    if (passwordChanged) member.changePassword(passwords.hash(request.newPassword()));
    return account(member);
  }

  @Transactional
  public void withdraw() { member().changeStatus("withdrawn"); }

  private AccountResponseDto account(Member member) {
    return new AccountResponseDto(member.getEmail(), member.getNickname(), member.getCreatedAt());
  }

  public MembershipResponseDto getMembership() {
    member();
    long count = orders.findByMemberIdOrderByCreatedAtDesc(currentMember.id()).stream()
        .filter(o -> !o.getStatus().equals("cancelled")).count();
    int level = count >= 20 ? 2 : count >= 5 ? 1 : 0;
    return new MembershipResponseDto(level, switch (level) {
      case 2 -> "별빛 마도사";
      case 1 -> "달빛 연금사";
      default -> "수습생";
    }, count, level == 2 ? null : level == 1 ? 20 : 5);
  }

  @Transactional
  public MyOrderDetailResponseDto createOrder(OrderCreateRequestDto request) {
    var buyer = member();
    var order = Order.builder()
        .member(buyer)
        .orderNumber("NC" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"))
            + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT))
        .status("ordered")
        .pickupName(request.pickupName().trim())
        .pickupType(request.pickupType())
        .request(request.request() == null ? null : request.request().trim())
        .build();
    for (var item : request.items()) {
      order.addItem(OrderItem.builder()
          .itemType("menu")
          .name(item.name().trim())
          .options(item.options())
          .unitPrice(item.unitPrice())
          .quantity(item.quantity())
          .build());
    }
    if (order.getTotalPrice() > 10_000_000) throw new IllegalArgumentException("주문 금액이 너무 큽니다.");
    return detail(orders.saveAndFlush(order));
  }

  public List<MyOrderListResponseDto> getOrders(String status, Integer size) {
    member();
    if (status != null && !List.of("ordered", "paid", "brewing", "ready", "done", "cancelled").contains(status))
      throw new IllegalArgumentException("주문 상태를 확인하세요.");
    checkSize(size);
    return orders.findByMemberIdOrderByCreatedAtDesc(currentMember.id()).stream()
        .filter(o -> status == null || o.getStatus().equals(status))
        .limit(size == null ? 100 : size).map(this::orderList).toList();
  }

  public MyOrderSummaryResponseDto getOrderSummary() {
    member();
    var list = orders.findByMemberIdOrderByCreatedAtDesc(currentMember.id());
    return new MyOrderSummaryResponseDto(list.size(), list.stream().filter(o -> List.of("ordered", "paid", "brewing", "ready").contains(o.getStatus())).count(),
        list.stream().filter(o -> o.getStatus().equals("done")).count(), list.stream().filter(o -> o.getStatus().equals("cancelled")).count());
  }

  public MyOrderDetailResponseDto getOrder(Long id) {
    member();
    return detail(ownedOrder(id));
  }

  @Transactional
  public MyOrderDetailResponseDto cancelOrder(Long id, MyOrderStatusRequestDto request) {
    member();
    if (!"cancelled".equals(request.status())) throw new IllegalArgumentException("회원은 주문 취소만 할 수 있습니다.");
    var order = ownedOrder(id);
    order.cancel();
    return detail(order);
  }

  private Order ownedOrder(Long id) {
    return orders.findByIdAndMemberId(id, currentMember.id())
        .orElseThrow(() -> new NotFoundException("주문을 찾을 수 없습니다: " + id));
  }

  private MyOrderListResponseDto orderList(Order o) {
    String first = o.getItems().isEmpty() ? "주문 항목 없음" : o.getItems().get(0).getName();
    String summary = first + (o.getItems().size() > 1 ? " 외 " + (o.getItems().size() - 1) + "건" : "");
    return new MyOrderListResponseDto(o.getId(), o.getOrderNumber(), o.getStatus(), summary, o.getTotalPrice(), o.getCreatedAt());
  }

  private MyOrderDetailResponseDto detail(Order o) {
    var base = orderList(o);
    var items = o.getItems().stream().map(i -> new MyOrderDetailResponseDto.Item(
        i.getName(), i.getOptions(), i.getUnitPrice(), i.getQuantity(), i.lineTotal())).toList();
    var payment = payments.findByOrderId(o.getId()).map(p -> new MyOrderDetailResponseDto.PaymentInfo(
        p.getMethod(), p.getDetail(), p.getAmount(), p.getApprovalCode(), p.getPaidAt())).orElse(null);
    return new MyOrderDetailResponseDto(base.id(), base.orderNumber(), base.status(), base.itemSummary(),
        base.totalPrice(), base.createdAt(), o.getPickupName(), o.getPickupType(), o.getRequest(), items, payment);
  }

  public List<MyPotionShowcaseListResponseDto> getShowcases(Integer size) {
    member();
    checkSize(size);
    var list = showcases.findByMemberWithDetails(currentMember.id());
    Map<Long, ShowcaseRatingRepository.RatingSummary> summary = list.isEmpty() ? Map.of() : ratings.summarize(list.stream().map(PotionShowcase::getId).toList()).stream()
        .collect(Collectors.toMap(ShowcaseRatingRepository.RatingSummary::getShowcaseId, Function.identity()));
    return list.stream().limit(size == null ? 100 : size).map(s -> new MyPotionShowcaseListResponseDto(
        s.getId(), s.getTitle(), s.getRecipe().getName(),
        summary.containsKey(s.getId()) ? summary.get(s.getId()).getAverageScore() : 0.0, s.getCreatedAt())).toList();
  }

  public List<MyRecipeListResponseDto> getRecipes() {
    member();
    return recipes.findByMemberIdOrderByCreatedAtDesc(currentMember.id()).stream()
        .map(MyRecipeListResponseDto::from).toList();
  }

  private void checkSize(Integer size) {
    if (size != null && (size < 1 || size > 100)) throw new IllegalArgumentException("size는 1~100이어야 합니다.");
  }
}
