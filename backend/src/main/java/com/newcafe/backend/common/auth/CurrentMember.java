package com.newcafe.backend.common.auth;

import org.springframework.stereotype.Component;

// "지금 요청한 회원"의 id 를 꺼내는 곳. 회원 기능(/api/v1/my/..., 장바구니, 주문, 포션 자랑)은 모두 여기서 받는다
// 인증 시스템을 붙이기 전까지는 1번 회원으로 고정한다 (시작 데이터 data.sql 의 첫 회원)
// 인증을 붙이면 이 메서드 안만 "로그인한 회원의 id"로 바꾸면 된다
//
// 사용 예 (서비스에서 주입받아 쓴다)
//   private final CurrentMember currentMember;
//   Long memberId = currentMember.id();
@Component
public class CurrentMember {

  public Long id() {
    return 1L;
  }
}
