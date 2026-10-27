package com.newcafe.backend.controller;

import com.newcafe.backend.dto.showcase.*;
import com.newcafe.backend.service.PotionShowcaseService;
import com.newcafe.backend.service.ShowcaseCommentService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/potion-showcases")
@RequiredArgsConstructor
public class PotionShowcaseController {
  private final PotionShowcaseService service;
  private final ShowcaseCommentService comments;

  @GetMapping
  public List<PotionShowcaseListResponseDto> getList(@RequestParam(defaultValue = "latest") String sort,
      @RequestParam(required = false) Integer size) { return service.getList(sort, size); }

  @GetMapping("/{id}")
  public PotionShowcaseDetailResponseDto getDetail(@PathVariable Long id) { return service.getDetail(id); }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PotionShowcaseDetailResponseDto create(@Valid @RequestBody PotionShowcaseCreateRequestDto request) { return service.create(request); }

  @PutMapping("/{id}")
  public PotionShowcaseDetailResponseDto update(@PathVariable Long id, @Valid @RequestBody PotionShowcaseUpdateRequestDto request) { return service.update(id, request); }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) { service.delete(id); }

  @RequestMapping(path = "/{id}/ratings", method = {RequestMethod.PUT, RequestMethod.POST})
  public ShowcaseRatingResponseDto rate(@PathVariable Long id, @Valid @RequestBody ShowcaseRatingRequestDto request) { return service.rate(id, request); }

  @GetMapping("/{id}/comments")
  public List<ShowcaseCommentResponseDto> comments(@PathVariable Long id) { return comments.getList(id); }

  @PostMapping("/{id}/comments")
  @ResponseStatus(HttpStatus.CREATED)
  public ShowcaseCommentResponseDto createComment(@PathVariable Long id, @Valid @RequestBody ShowcaseCommentCreateRequestDto request) {
    return comments.create(id, request);
  }

  @DeleteMapping("/{id}/comments/{commentId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteComment(@PathVariable Long id, @PathVariable Long commentId) { comments.delete(id, commentId); }
}
