package com.newcafe.backend.dto.my.account;

import jakarta.validation.constraints.*;

public record SignUpRequestDto(
    @NotBlank @Email @Size(max = 254) String email,
    @NotBlank @Size(min = 8, max = 72) String password,
    @NotBlank @Size(max = 20) String nickname) {}
