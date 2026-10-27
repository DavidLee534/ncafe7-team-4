package com.newcafe.backend.service.my;

import com.newcafe.backend.dto.my.cart.CartItemCreateRequestDto;
import com.newcafe.backend.dto.my.cart.CartItemCreatedResponseDto;

public interface MyCartService {
  CartItemCreatedResponseDto add(CartItemCreateRequestDto request);
}
