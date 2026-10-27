package com.newcafe.backend.controller.checkout;

import com.newcafe.backend.dto.checkout.CartEntryRequest;
import com.newcafe.backend.dto.checkout.CartEntryResponse;
import com.newcafe.backend.dto.checkout.CartQuantityRequest;
import com.newcafe.backend.dto.checkout.CartResponse;
import com.newcafe.backend.dto.checkout.CatalogEntryResponse;
import com.newcafe.backend.service.checkout.CartService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/my/cart")
@RequiredArgsConstructor
public class CartCheckoutController {
    private final CartService service;

    @GetMapping("/items")
    public CartResponse list() { return service.cart(); }

    @GetMapping("/catalog")
    public List<CatalogEntryResponse> catalog() { return service.catalog(); }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartEntryResponse add(@Valid @RequestBody CartEntryRequest request) { return service.add(request); }

    @PatchMapping("/items/{id}")
    public CartEntryResponse change(@PathVariable Long id, @Valid @RequestBody CartQuantityRequest request) {
        return service.changeQuantity(id, request.quantity().intValueExact());
    }

    @DeleteMapping("/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long id) { service.remove(id); }

    @DeleteMapping("/items")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clear() { service.clear(); }
}
