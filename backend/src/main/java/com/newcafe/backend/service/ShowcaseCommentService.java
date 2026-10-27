package com.newcafe.backend.service;

import com.newcafe.backend.dto.showcase.ShowcaseCommentCreateRequestDto;
import com.newcafe.backend.dto.showcase.ShowcaseCommentResponseDto;
import java.util.List;

public interface ShowcaseCommentService {
  List<ShowcaseCommentResponseDto> getList(Long showcaseId);
  ShowcaseCommentResponseDto create(Long showcaseId, ShowcaseCommentCreateRequestDto request);
  void delete(Long showcaseId, Long commentId);
}
