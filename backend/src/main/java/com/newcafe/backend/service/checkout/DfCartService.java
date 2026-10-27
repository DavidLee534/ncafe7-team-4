package com.newcafe.backend.service.checkout;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.checkout.CartEntryRequest;
import com.newcafe.backend.dto.checkout.CartEntryResponse;
import com.newcafe.backend.dto.checkout.CartResponse;
import com.newcafe.backend.entity.CartItem;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.repository.MenuRepository;
import com.newcafe.backend.repository.PotionShowcaseRepository;
import com.newcafe.backend.repository.RecipeRepository;
import com.newcafe.backend.repository.checkout.CheckoutCartRepository;
import com.newcafe.backend.repository.checkout.CheckoutMemberRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class DfCartService implements CartService {
    private static final int MAX_QUANTITY = 20;
    private final CurrentMember currentMember;
    private final CheckoutMemberRepository members;
    private final CheckoutCartRepository cartItems;
    private final MenuRepository menus;
    private final RecipeRepository recipes;
    private final PotionShowcaseRepository showcases;

    private Member member() {
        Member member = members.lockMember(currentMember.id())
            .orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다."));
        if (!"active".equals(member.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "활성 회원만 이용할 수 있습니다.");
        }
        return member;
    }

    public CartResponse cart() {
        return snapshot(member().getId());
    }

    public CartEntryResponse add(CartEntryRequest request) {
        Member member = member();
        if (!request.isSingleProduct()) throw new IllegalArgumentException("상품 하나만 선택하세요.");
        int quantity = request.requestedQuantity();
        checkQuantity(quantity);
        List<CartItem> existing = cartItems.findByMemberIdOrderByIdAsc(member.getId());
        CartItem item;
        if (request.menuId() != null) {
            Menu menu = menus.findById(request.menuId())
                .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다."));
            requireAvailable(menu);
            item = existing.stream().filter(row -> row.getMenu() != null &&
                row.getMenu().getId().equals(menu.getId())).findFirst().orElse(null);
            if (item == null) item = CartItem.builder().member(member).menu(menu).quantity(quantity).build();
            else {
                checkQuantity(item.getQuantity() + quantity);
                item.addQuantity(quantity);
            }
        } else {
            // 내 레시피, 또는 포션 자랑 게시판에 올라온 남의 포션을 담을 수 있다 (13.0 자랑글 "장바구니 담기")
            var recipe = recipes.findById(request.recipeId())
                .filter(value -> value.getMember().getId().equals(member.getId())
                    || showcases.existsByRecipeId(value.getId()))
                .orElseThrow(() -> new NotFoundException("내 레시피나 자랑글에 올라온 포션만 담을 수 있습니다."));
            requireAvailable(recipe.getBaseMenu());
            item = existing.stream().filter(row -> row.getRecipe() != null &&
                row.getRecipe().getId().equals(recipe.getId())).findFirst().orElse(null);
            if (item == null) item = CartItem.builder().member(member).recipe(recipe).quantity(quantity).build();
            else {
                checkQuantity(item.getQuantity() + quantity);
                item.addQuantity(quantity);
            }
        }
        if (item.getId() == null && existing.size() >= 100) {
            throw new IllegalStateException("장바구니에는 최대 100종까지 담을 수 있습니다.");
        }
        return CartEntryResponse.from(cartItems.saveAndFlush(item));
    }

    public CartEntryResponse changeQuantity(Long id, int quantity) {
        Member member = member();
        checkQuantity(quantity);
        CartItem item = ownedItem(id, member.getId());
        item.changeQuantity(quantity);
        return CartEntryResponse.from(item);
    }

    public void remove(Long id) {
        Member member = member();
        cartItems.delete(ownedItem(id, member.getId()));
    }

    public void clear() {
        Member member = member();
        cartItems.deleteAll(cartItems.findByMemberIdOrderByIdAsc(member.getId()));
    }

    private CartItem ownedItem(Long id, Long memberId) {
        return cartItems.findByIdAndMemberId(id, memberId)
            .orElseThrow(() -> new NotFoundException("장바구니 항목을 찾을 수 없습니다."));
    }

    private CartResponse snapshot(Long memberId) {
        List<CartEntryResponse> items = cartItems.findByMemberIdOrderByIdAsc(memberId).stream()
            .map(CartEntryResponse::from).toList();
        StringBuilder source = new StringBuilder();
        items.forEach(item -> source.append(pack(item.id())).append(pack(item.quantity()))
            .append(pack(item.unitPrice())).append(pack(item.name())).append(pack(item.options()))
            .append(pack(item.available())));
        return new CartResponse(items, items.stream().mapToLong(CartEntryResponse::lineTotal).sum(),
            items.stream().mapToInt(CartEntryResponse::quantity).sum(), hash(source.toString()));
    }

    private static boolean available(Menu menu) {
        return "on".equals(menu.getStatus()) && menu.getCategory().isVisible();
    }

    private static void requireAvailable(Menu menu) {
        if (!available(menu)) throw new IllegalStateException("판매 중인 메뉴만 담거나 주문할 수 있습니다.");
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
