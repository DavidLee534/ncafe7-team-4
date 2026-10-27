package com.newcafe.backend.dto.showcase;

import java.time.LocalDateTime;

public record ShowcaseCommentResponseDto(Long id, Long parentId, String nickname, String content,
    LocalDateTime createdAt, boolean mine, boolean deleted) {}
