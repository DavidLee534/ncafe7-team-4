package com.newcafe.backend.dto.my.account;

import jakarta.validation.constraints.*;

public record LoginRequestDto(
    @NotBlank @Email String email,
    @NotBlank String password) {}
