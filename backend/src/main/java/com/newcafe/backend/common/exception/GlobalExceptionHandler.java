package com.newcafe.backend.common.exception;

import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// 서비스 계층의 예외를 HTTP 상태코드로 바꾼다. 응답 본문은 {"message": "..."} 형태.
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
    }

    // 업무 규칙상 지금 상태에서 할 수 없는 요청 (예: 빈 장바구니로 주문, 이미 진행된 주문 취소)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException e) {
        String message = Objects.requireNonNullElse(e.getMessage(), "요청을 처리할 수 없는 상태입니다.");
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", message));
    }
}
