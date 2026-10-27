package com.newcafe.backend.service;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.showcase.*;
import com.newcafe.backend.entity.*;
import com.newcafe.backend.repository.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfPotionShowcaseService implements PotionShowcaseService {
  private final PotionShowcaseRepository showcases;
  private final ShowcaseRatingRepository ratings;
  private final RecipeRepository recipes;
  private final MemberRepository members;
  private final CurrentMember currentMember;

  public List<PotionShowcaseListResponseDto> getList(String sort, Integer size) {
    activeMember();
    if (sort != null && !sort.equals("latest") && !sort.equals("rating")) throw new IllegalArgumentException("정렬 기준을 확인하세요.");
    if (size != null && (size < 1 || size > 100)) throw new IllegalArgumentException("size는 1~100이어야 합니다.");
    var list = showcases.findAllWithDetails();
    var summaries = summaryMap(list.stream().map(PotionShowcase::getId).toList());
    if ("rating".equals(sort)) list.sort(Comparator
        .comparingDouble((PotionShowcase s) -> average(summaries.get(s.getId()))).reversed()
        .thenComparing(PotionShowcase::getCreatedAt, Comparator.reverseOrder()));
    return list.stream().limit(size == null ? 100 : size)
        .map(s -> toList(s, summaries.get(s.getId()))).toList();
  }

  public PotionShowcaseDetailResponseDto getDetail(Long id) {
    activeMember();
    return detail(find(id));
  }

  @Transactional
  public PotionShowcaseDetailResponseDto create(PotionShowcaseCreateRequestDto request) {
    var member = activeMember();
    var recipe = recipes.findById(request.recipeId()).orElseThrow(() -> new NotFoundException("포션을 찾을 수 없습니다: " + request.recipeId()));
    if (!recipe.getMember().getId().equals(member.getId())) throw new IllegalStateException("내 포션만 자랑할 수 있습니다.");
    return detail(showcases.save(PotionShowcase.builder().member(member).recipe(recipe)
        .title(request.title().trim()).content(request.content()).build()));
  }

  @Transactional
  public PotionShowcaseDetailResponseDto update(Long id, PotionShowcaseUpdateRequestDto request) {
    activeMember();
    var showcase = find(id);
    requireOwner(showcase);
    showcase.update(request.title().trim(), request.content());
    return detail(showcase);
  }

  @Transactional
  public void delete(Long id) {
    activeMember();
    var showcase = find(id);
    requireOwner(showcase);
    ratings.deleteByShowcaseId(id);
    ratings.flush();
    showcases.delete(showcase);
  }

  @Transactional
  public ShowcaseRatingResponseDto rate(Long id, ShowcaseRatingRequestDto request) {
    var member = activeMember();
    var showcase = find(id);
    if (showcase.getMember().getId().equals(currentMember.id())) throw new IllegalStateException("자신의 글에는 별점을 줄 수 없습니다.");
    var rating = ratings.findByShowcaseIdAndMemberId(id, member.getId());
    if (rating.isPresent()) rating.get().changeScore(request.score());
    else ratings.save(ShowcaseRating.builder().showcase(showcase).member(member).score(request.score()).build());
    ratings.flush();
    var summary = summaryMap(List.of(id)).get(id);
    return new ShowcaseRatingResponseDto(average(summary), count(summary), request.score());
  }

  private PotionShowcase find(Long id) {
    return showcases.findById(id).orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다: " + id));
  }

  private Member activeMember() {
    var member = members.findById(currentMember.id()).orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다: " + currentMember.id()));
    if (!"active".equals(member.getStatus())) throw new ForbiddenException("활성 회원만 이용할 수 있습니다.");
    return member;
  }

  private void requireOwner(PotionShowcase showcase) {
    if (!showcase.getMember().getId().equals(currentMember.id())) throw new ForbiddenException("작성자만 수정하거나 삭제할 수 있습니다.");
  }

  private Map<Long, ShowcaseRatingRepository.RatingSummary> summaryMap(List<Long> ids) {
    if (ids.isEmpty()) return Map.of();
    return ratings.summarize(ids).stream().collect(Collectors.toMap(ShowcaseRatingRepository.RatingSummary::getShowcaseId, Function.identity()));
  }

  private double average(ShowcaseRatingRepository.RatingSummary summary) { return summary == null ? 0.0 : summary.getAverageScore(); }
  private long count(ShowcaseRatingRepository.RatingSummary summary) { return summary == null ? 0L : summary.getRatingCount(); }

  private PotionShowcaseListResponseDto toList(PotionShowcase s, ShowcaseRatingRepository.RatingSummary summary) {
    return new PotionShowcaseListResponseDto(s.getId(), s.getTitle(), s.getMember().getNickname(),
        s.getRecipe().getName(), s.getRecipe().getGrade(), s.getRecipe().getColor(),
        average(summary), count(summary), s.getCreatedAt());
  }

  private PotionShowcaseDetailResponseDto detail(PotionShowcase s) {
    var summary = summaryMap(List.of(s.getId())).get(s.getId());
    var myScore = ratings.findByShowcaseIdAndMemberId(s.getId(), currentMember.id())
        .map(ShowcaseRating::getScore).orElse(null);
    return new PotionShowcaseDetailResponseDto(s.getId(), s.getTitle(), s.getMember().getNickname(),
        s.getRecipe().getName(), s.getRecipe().getGrade(), s.getRecipe().getColor(),
        average(summary), count(summary), s.getCreatedAt(), s.getContent(), s.getRecipe().getId(),
        s.getRecipe().getPrice(), myScore, s.getMember().getId().equals(currentMember.id()));
  }
}
