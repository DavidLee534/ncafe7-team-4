package com.newcafe.backend.dto.checkout;

public record CatalogEntryResponse(Long menuId, Long recipeId, String name, int unitPrice, String imageUrl) {
}
