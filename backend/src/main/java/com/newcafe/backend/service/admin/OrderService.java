package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.order.OrderDetailResponseDto;
import com.newcafe.backend.dto.admin.order.OrderListRequestDto;
import com.newcafe.backend.dto.admin.order.OrderListResponseDto;
import com.newcafe.backend.dto.admin.order.OrderStatusRequestDto;
import com.newcafe.backend.dto.admin.order.OrderStatusResponseDto;
import com.newcafe.backend.dto.admin.order.OrderSummaryResponseDto;

import java.util.List;

// 관리자 주문 관리 업무. 구현체는 DfOrderService
// 주문은 회원이 만들므로 관리자는 보고(목록·상세) 제조 상태만 바꾼다. 등록·수정·삭제는 없다
public interface OrderService {

  List<OrderListResponseDto> getList(OrderListRequestDto request);

  OrderSummaryResponseDto getSummary();

  OrderDetailResponseDto getDetail(Long id);

  OrderStatusResponseDto changeStatus(Long id, OrderStatusRequestDto request);
}
