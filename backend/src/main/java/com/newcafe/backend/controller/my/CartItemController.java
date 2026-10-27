package com.newcafe.backend.controller.my;

import com.newcafe.backend.dto.my.cart.*;
import com.newcafe.backend.service.my.MyCartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController("myCartItemController")
@RequestMapping("/api/v1/my/cart/items")
@RequiredArgsConstructor
public class CartItemController {
  private final MyCartService service;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CartItemCreatedResponseDto add(@Valid @RequestBody CartItemCreateRequestDto request) {
    return service.add(request);
  }
}
