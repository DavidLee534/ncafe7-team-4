package com.newcafe.backend.dto.my.account;

import jakarta.validation.constraints.*;

public record AccountUpdateRequestDto(
    @NotBlank @Size(max = 20) String nickname,
    @NotBlank @Email @Size(max = 254) String email,
    String currentPassword,
    @Size(min = 8, max = 72) String newPassword) {}
