package com.newcafe.backend.dto.my.account;

import java.time.LocalDateTime;

public record AccountResponseDto(String email, String nickname, LocalDateTime createdAt) {}
