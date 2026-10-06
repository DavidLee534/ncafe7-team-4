package com.newcafe.backend.common.exception;

// 요청한 자원(메뉴, 장바구니 항목, 주문 등)이 없을 때 서비스 계층에서 던진다. 404로 응답된다.
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
