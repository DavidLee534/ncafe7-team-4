package com.newcafe.backend.dto.my.order;

import jakarta.validation.constraints.Pattern;

public record MyOrderStatusRequestDto(@Pattern(regexp = "cancelled") String status) {}
