package com.newcafe.backend.common.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    // DB 제약 위반 (다른 데이터가 참조 중인 행 삭제, 중복 값 등) → 409
    // 서비스에서 미리 막지 못한 경우를 위한 안전장치. 원래 메시지에는 테이블·컬럼 이름이 있어서 그대로 보내지 않는다
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "다른 데이터에서 사용 중이거나 이미 있는 값이라 처리할 수 없습니다."));
    }

    // 요청 본문 검증(@Valid) 실패 → 400
    // message에는 첫 번째 오류를, errors에는 필드별 오류를 모두 담는다
    // 예: {"message": "한글 이름을 입력하세요.", "errors": {"korName": "한글 이름을 입력하세요.", "price": "..."}}
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleNotValid(MethodArgumentNotValidException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        String message = errors.values().stream().findFirst().orElse("입력값을 확인하세요.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", message, "errors", errors));
    }

    // 본문을 읽을 수 없는 요청 (JSON 형식 오류, 숫자 자리에 문자 등) → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleNotReadable(HttpMessageNotReadableException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "요청 형식이 올바르지 않습니다."));
    }
}
