package com.newcafe.backend.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.dto.showcase.*;
import com.newcafe.backend.entity.*;
import com.newcafe.backend.repository.*;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DfPotionShowcaseServiceTest {
  private final PotionShowcaseRepository showcases = mock(PotionShowcaseRepository.class);
  private final ShowcaseRatingRepository ratings = mock(ShowcaseRatingRepository.class);
  private final RecipeRepository recipes = mock(RecipeRepository.class);
  private final MemberRepository members = mock(MemberRepository.class);
  private final CurrentMember currentMember = mock(CurrentMember.class);
  private DfPotionShowcaseService service;
  private Member me;

  @BeforeEach
  void setup() {
    service = new DfPotionShowcaseService(showcases, ratings, recipes, members, currentMember);
    me = mock(Member.class);
    when(currentMember.id()).thenReturn(1L);
    when(me.getId()).thenReturn(1L);
    when(me.getStatus()).thenReturn("active");
    when(members.findById(1L)).thenReturn(Optional.of(me));
  }

  @Test
  void cannotPublishAnotherMembersRecipe() {
    var owner = mock(Member.class);
    when(owner.getId()).thenReturn(2L);
    var recipe = mock(Recipe.class);
    when(recipe.getMember()).thenReturn(owner);
    when(recipes.findById(7L)).thenReturn(Optional.of(recipe));

    assertThrows(IllegalStateException.class,
        () -> service.create(new PotionShowcaseCreateRequestDto(7L, "포션", "소개")));
    verify(showcases, never()).save(any());
  }

  @Test
  void onlyAuthorCanEdit() {
    var owner = mock(Member.class);
    when(owner.getId()).thenReturn(2L);
    var showcase = PotionShowcase.builder().member(owner).recipe(mock(Recipe.class))
        .title("기존 글").content("소개").build();
    when(showcases.findById(4L)).thenReturn(Optional.of(showcase));

    assertThrows(ForbiddenException.class,
        () -> service.update(4L, new PotionShowcaseUpdateRequestDto("수정", "내용")));
    verify(showcases, never()).save(any());
  }

  @Test
  void authorCannotRateOwnPost() {
    var showcase = PotionShowcase.builder().member(me).recipe(mock(Recipe.class))
        .title("내 글").build();
    when(showcases.findById(4L)).thenReturn(Optional.of(showcase));

    assertThrows(IllegalStateException.class,
        () -> service.rate(4L, new ShowcaseRatingRequestDto(5)));
    verifyNoInteractions(ratings);
  }
}
