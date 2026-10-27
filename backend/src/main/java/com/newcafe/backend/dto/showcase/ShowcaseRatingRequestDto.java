package com.newcafe.backend.dto.showcase;

import jakarta.validation.constraints.*;

public record ShowcaseRatingRequestDto(@NotNull @Min(1) @Max(5) Integer score) {}
