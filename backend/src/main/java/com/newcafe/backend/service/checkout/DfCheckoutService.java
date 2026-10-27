package com.newcafe.backend.service.checkout;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.checkout.CartEntryResponse;
import com.newcafe.backend.dto.checkout.CartResponse;
import com.newcafe.backend.dto.checkout.CheckoutReceiptResponse;
import com.newcafe.backend.dto.checkout.CheckoutRequest;
import com.newcafe.backend.entity.CheckoutAttempt;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.entity.Order;
import com.newcafe.backend.entity.OrderItem;
import com.newcafe.backend.entity.Payment;
import com.newcafe.backend.repository.checkout.CheckoutAttemptRepository;
import com.newcafe.backend.repository.checkout.CheckoutCartRepository;
import com.newcafe.backend.repository.checkout.CheckoutMemberRepository;
import com.newcafe.backend.repository.checkout.CheckoutOrderRepository;
import com.newcafe.backend.repository.checkout.CheckoutPaymentRepository;
import jakarta.persistence.EntityManager;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class DfCheckoutService implements CheckoutService {
    private static final int MAX_QUANTITY = 20;
    private static final long MAX_TOTAL = 10_000_000;
    private final CurrentMember currentMember;
    private final CheckoutMemberRepository members;
    private final CheckoutCartRepository cartItems;
    private final CheckoutOrderRepository orders;
    private final CheckoutPaymentRepository payments;
    private final CheckoutAttemptRepository attempts;
    private final CartService carts;
    private final EntityManager entityManager;

    private Member member() {
        Member member = members.lockMember(currentMember.id())
            .orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다."));
        if (!"active".equals(member.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "활성 회원만 이용할 수 있습니다.");
        }
        return member;
    }

    public CheckoutReceiptResponse checkout(String key, CheckoutRequest request) {
        Member member = member();
        if (key == null || !key.matches("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")) {
            throw new IllegalArgumentException("Idempotency-Key에 UUID를 보내세요.");
        }
        String attemptId = member.getId() + ":" + key.toLowerCase(java.util.Locale.ROOT);
        // 길이 접두어를 사용해 구분자가 포함된 입력도 서로 다른 요청으로 비교한다.
        String requestHash = hash(pack(request.pickupName()) + pack(request.pickupType()) +
            pack(request.request()) + pack(request.payMethod()) + pack(request.payDetail()) + pack(request.cartVersion()));
        var previous = attempts.findById(attemptId);
        if (previous.isPresent()) {
            if (!previous.get().getRequestHash().equals(requestHash)) {
                throw new IllegalStateException("같은 결제 키로 다른 주문을 요청할 수 없습니다.");
            }
            return receiptOf(previous.get().getOrder());
        }
        CartResponse cart = carts.cart();
        if (cart.items().isEmpty()) throw new IllegalStateException("장바구니가 비어 있습니다.");
        if (!cart.version().equals(request.cartVersion())) {
            throw new IllegalStateException("장바구니 또는 가격이 바뀌었습니다. 목록을 확인한 뒤 다시 결제하세요.");
        }
        if (cart.items().stream().anyMatch(item -> !item.available())) {
            throw new IllegalStateException("품절되거나 숨겨진 상품을 장바구니에서 빼 주세요.");
        }
        if (cart.totalPrice() <= 0 || cart.totalPrice() > MAX_TOTAL) {
            throw new IllegalStateException("결제 가능한 주문 금액을 초과했습니다.");
        }
        Order order = Order.builder().member(member)
            .orderNumber("NC" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd")) +
                "-" + UUID.randomUUID().toString().replace("-", ""))
            .status("paid").pickupName(request.pickupName().trim()).pickupType(request.pickupType())
            .request(request.request() == null ? null : request.request().trim()).build();
        for (CartEntryResponse item : cart.items()) {
            checkQuantity(item.quantity());
            if (item.unitPrice() < 0) throw new IllegalStateException("상품 가격을 확인하세요.");
            order.addItem(OrderItem.builder().itemType(item.itemType()).name(item.name())
                .options(String.join(", ", item.options())).unitPrice(item.unitPrice()).quantity(item.quantity()).build());
        }
        orders.saveAndFlush(order);
        Payment payment = payments.saveAndFlush(Payment.builder().order(order).method(request.payMethod())
            .detail(request.payDetail()).amount(order.getTotalPrice())
            .approvalCode("MOCK-" + UUID.randomUUID().toString()).build());
        // DB의 timestamp 정밀도로 다시 읽어 첫 응답과 재시도 응답을 동일하게 유지한다.
        entityManager.refresh(payment);
        attempts.save(new CheckoutAttempt(attemptId, member, order, requestHash));
        cartItems.deleteAll(cartItems.findByMemberIdOrderByIdAsc(member.getId()));
        return receiptOf(order);
    }

    public CheckoutReceiptResponse receipt(Long id) {
        Member member = member();
        return receiptOf(orders.findByIdAndMemberId(id, member.getId())
            .orElseThrow(() -> new NotFoundException("주문을 찾을 수 없습니다.")));
    }

    private CheckoutReceiptResponse receiptOf(Order order) {
        Payment payment = payments.findByOrderId(order.getId())
            .orElseThrow(() -> new NotFoundException("결제 기록을 찾을 수 없습니다."));
        return CheckoutReceiptResponse.from(order, payment);
    }

    private static void checkQuantity(int quantity) {
        if (quantity < 1 || quantity > MAX_QUANTITY) {
            throw new IllegalArgumentException("수량은 1~20개여야 합니다.");
        }
    }

    private static String pack(Object value) {
        String text = value == null ? "" : value.toString();
        return text.length() + ":" + text;
    }

    private static String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("주문 확인 값을 만들 수 없습니다.", exception);
        }
    }
}
