package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.order.OrderDetailResponseDto;
import com.newcafe.backend.dto.admin.order.OrderListRequestDto;
import com.newcafe.backend.dto.admin.order.OrderListResponseDto;
import com.newcafe.backend.dto.admin.order.OrderStatusRequestDto;
import com.newcafe.backend.dto.admin.order.OrderStatusResponseDto;
import com.newcafe.backend.dto.admin.order.OrderSummaryResponseDto;
import com.newcafe.backend.service.admin.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  // 주문 목록. 쿼리스트링의 조건(?status=&keyword=&sort=&size=)으로 거른다. 조건이 없으면 전체(최근 주문부터)
  @GetMapping
  public List<OrderListResponseDto> getList(@ModelAttribute OrderListRequestDto request) {
    return orderService.getList(request);
  }

  // 상태별 주문 수와 오늘 매출
  @GetMapping("/summary")
  public OrderSummaryResponseDto getSummary() {
    return orderService.getSummary();
  }

  // 주문 상세 (항목·결제 포함). 없는 id면 404
  @GetMapping("/{id}")
  public OrderDetailResponseDto getDetail(@PathVariable Long id) {
    return orderService.getDetail(id);
  }

  // 제조 상태 변경. 상태 하나만 바꾸므로 PATCH. 순서에 맞지 않으면 409
  @PatchMapping("/{id}/status")
  public OrderStatusResponseDto changeStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequestDto request) {
    return orderService.changeStatus(id, request);
  }
}
