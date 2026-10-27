package com.newcafe.backend.dto.showcase;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ShowcaseCommentCreateRequestDto(@NotBlank @Size(max = 1000) String content, Long parentId) {}
