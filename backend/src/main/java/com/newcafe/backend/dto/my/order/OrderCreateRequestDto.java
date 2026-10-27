package com.newcafe.backend.dto.my.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record OrderCreateRequestDto(
    @NotBlank @Size(max = 12) String pickupName,
    @NotBlank @Pattern(regexp = "dine-in|takeout") String pickupType,
    @Size(max = 60) String request,
    @NotEmpty @Size(max = 30) List<@Valid Item> items) {
  public record Item(
      @NotBlank @Size(max = 100) String name,
      @Size(max = 500) String options,
      @NotNull @Min(1) @Max(1000000) Integer unitPrice,
      @NotNull @Min(1) @Max(20) Integer quantity) {}
}
