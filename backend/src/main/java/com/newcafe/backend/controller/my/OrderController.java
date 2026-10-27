package com.newcafe.backend.controller.my;

import com.newcafe.backend.dto.my.order.*;
import com.newcafe.backend.service.my.MyPageService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("myOrderController")
@RequestMapping("/api/v1/my/orders")
@RequiredArgsConstructor
public class OrderController {
  private final MyPageService service;

  @PostMapping
  public MyOrderDetailResponseDto create(@Valid @RequestBody OrderCreateRequestDto request) {
    return service.createOrder(request);
  }

  @GetMapping
  public List<MyOrderListResponseDto> getList(@RequestParam(required = false) String status,
      @RequestParam(required = false) Integer size) { return service.getOrders(status, size); }

  @GetMapping("/summary")
  public MyOrderSummaryResponseDto getSummary() { return service.getOrderSummary(); }

  @GetMapping("/{id}")
  public MyOrderDetailResponseDto getDetail(@PathVariable Long id) { return service.getOrder(id); }

  @PatchMapping("/{id}/status")
  public MyOrderDetailResponseDto cancel(@PathVariable Long id, @Valid @RequestBody MyOrderStatusRequestDto request) {
    return service.cancelOrder(id, request);
  }
}
