package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.order.OrderDetailResponseDto;
import com.newcafe.backend.dto.admin.order.OrderListRequestDto;
import com.newcafe.backend.dto.admin.order.OrderListResponseDto;
import com.newcafe.backend.dto.admin.order.OrderStatusRequestDto;
import com.newcafe.backend.dto.admin.order.OrderStatusResponseDto;
import com.newcafe.backend.dto.admin.order.OrderSummaryResponseDto;
import com.newcafe.backend.entity.Order;
import com.newcafe.backend.repository.OrderItemRepository;
import com.newcafe.backend.repository.OrderRepository;
import com.newcafe.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfOrderService implements OrderService {

  private final OrderRepository orderRepository;
  private final OrderItemRepository orderItemRepository;
  private final PaymentRepository paymentRepository;

  // 빈 문자열 조건(?keyword=)은 조건 없음(null)으로 바꿔서 넘긴다
  // sort=oldest면 오래된 주문부터, 그 밖에는 최근 주문부터. size가 있으면 앞에서부터 그 개수만
  // 잔 수는 목록의 주문 id로 한 번에 센다 (주문마다 items를 불러오면 N+1)
  @Override
  public List<OrderListResponseDto> getList(OrderListRequestDto request) {
    Sort sort = "oldest".equals(request.sort())
        ? Sort.by("createdAt", "id")
        : Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"));
    Pageable pageable = request.size() != null && request.size() > 0
        ? PageRequest.of(0, request.size(), sort)
        : Pageable.unpaged(sort);

    List<Order> orders = orderRepository.findAllByCondition(
        blankToNull(request.status()),
        blankToNull(request.keyword()),
        pageable);
    if (orders.isEmpty()) {
      return List.of();
    }

    Map<Long, Long> quantities = orderItemRepository
        .sumQuantityByOrderIds(orders.stream().map(Order::getId).toList())
        .stream()
        .collect(Collectors.toMap(
            OrderItemRepository.OrderQuantity::getOrderId,
            OrderItemRepository.OrderQuantity::getQuantity));

    return orders.stream()
        .map(order -> OrderListResponseDto.from(order, quantities.getOrDefault(order.getId(), 0L)))
        .toList();
  }

  // 주문을 상태별로 세고, 오늘 0시 이후 매출을 더한다
  @Override
  public OrderSummaryResponseDto getSummary() {
    return new OrderSummaryResponseDto(
        orderRepository.count(),
        orderRepository.countByStatus("paid"),
        orderRepository.countByStatus("brewing"),
        orderRepository.countByStatus("ready"),
        orderRepository.countByStatus("done"),
        orderRepository.countByStatus("cancelled"),
        orderRepository.sumSalesSince(LocalDate.now().atStartOfDay()));
  }

  // 주문·회원·항목은 한 번에, 결제는 따로 가져온다
  @Override
  public OrderDetailResponseDto getDetail(Long id) {
    Order order = orderRepository.findDetailById(id)
        .orElseThrow(() -> new NotFoundException("주문을 찾을 수 없습니다: " + id));
    return OrderDetailResponseDto.from(order, paymentRepository.findByOrderId(id).orElse(null));
  }

  // 순서에 맞지 않는 변경(예: paid → done, done → brewing)은 Order.changeStatus가 막는다(409)
  // 조회한 주문의 값을 바꾸면 트랜잭션이 끝날 때 UPDATE 된다
  @Override
  @Transactional
  public OrderStatusResponseDto changeStatus(Long id, OrderStatusRequestDto request) {
    Order order = orderRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("주문을 찾을 수 없습니다: " + id));
    order.changeStatus(request.status());
    return OrderStatusResponseDto.from(order);
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }
}
