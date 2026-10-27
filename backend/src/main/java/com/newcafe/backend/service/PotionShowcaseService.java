package com.newcafe.backend.service;

import com.newcafe.backend.dto.showcase.*;
import java.util.List;

public interface PotionShowcaseService {
  List<PotionShowcaseListResponseDto> getList(String sort, Integer size);
  PotionShowcaseDetailResponseDto getDetail(Long id);
  PotionShowcaseDetailResponseDto create(PotionShowcaseCreateRequestDto request);
  PotionShowcaseDetailResponseDto update(Long id, PotionShowcaseUpdateRequestDto request);
  void delete(Long id);
  ShowcaseRatingResponseDto rate(Long id, ShowcaseRatingRequestDto request);
}
