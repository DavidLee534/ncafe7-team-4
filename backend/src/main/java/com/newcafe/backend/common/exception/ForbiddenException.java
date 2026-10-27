package com.newcafe.backend.common.exception;

public class ForbiddenException extends RuntimeException {
  public ForbiddenException(String message) { super(message); }
}
