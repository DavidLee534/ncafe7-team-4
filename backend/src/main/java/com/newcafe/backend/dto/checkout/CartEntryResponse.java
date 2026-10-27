package com.newcafe.backend.dto.checkout;

import com.newcafe.backend.entity.CartItem;
import com.newcafe.backend.entity.Menu;
import java.util.List;

public record CartEntryResponse(
    Long id, String itemType, Long menuId, Long recipeId, String name, List<String> options,
    String imageUrl, int unitPrice, int quantity, long lineTotal, boolean available
) {
    public static CartEntryResponse from(CartItem item) {
        Menu menu = item.getMenu() != null ? item.getMenu() : item.getRecipe().getBaseMenu();
        boolean available = "on".equals(menu.getStatus()) && menu.getCategory().isVisible();
        return new CartEntryResponse(item.getId(), item.getMenu() != null ? "menu" : "recipe",
            item.getMenu() == null ? null : menu.getId(),
            item.getRecipe() == null ? null : item.getRecipe().getId(),
            item.getMenu() != null ? menu.getKorName() : item.getRecipe().getName(),
            item.getRecipe() == null ? List.of() : List.of(menu.getKorName()),
            menu.getImageUrl(), item.unitPrice(), item.getQuantity(),
            (long) item.unitPrice() * item.getQuantity(), available);
    }
}
