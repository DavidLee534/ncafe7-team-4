package com.newcafe.backend.service.my;

import com.newcafe.backend.dto.my.account.*;
import com.newcafe.backend.dto.my.order.*;
import com.newcafe.backend.dto.my.recipe.*;
import com.newcafe.backend.dto.my.showcase.*;
import java.util.List;

public interface MyPageService {
  AccountResponseDto getAccount();
  AccountResponseDto updateAccount(AccountUpdateRequestDto request);
  void withdraw();
  MembershipResponseDto getMembership();
  List<MyOrderListResponseDto> getOrders(String status, Integer size);
  MyOrderSummaryResponseDto getOrderSummary();
  MyOrderDetailResponseDto getOrder(Long id);
  MyOrderDetailResponseDto cancelOrder(Long id, MyOrderStatusRequestDto request);
  List<MyPotionShowcaseListResponseDto> getShowcases(Integer size);
  List<MyRecipeListResponseDto> getRecipes();
}
