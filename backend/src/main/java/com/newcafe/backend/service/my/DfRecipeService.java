package com.newcafe.backend.service.my;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.my.recipe.MyRecipeDetailResponseDto;
import com.newcafe.backend.dto.my.recipe.MyRecipeListResponseDto;
import com.newcafe.backend.dto.my.recipe.MyRecipeSummaryResponseDto;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipeDiscovery;
import com.newcafe.backend.repository.RecipeRepository;
import com.newcafe.backend.repository.SecretRecipeDiscoveryRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("myRecipeService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfRecipeService implements RecipeService {

  private final CurrentMember currentMember;
  private final RecipeRepository recipeRepository;
  private final SecretRecipeRepository secretRecipeRepository;
  private final SecretRecipeDiscoveryRepository discoveryRepository;

  // 내가 빚은 포션 (최근에 만든 것부터)
  @Override
  public List<MyRecipeListResponseDto> getList() {
    return recipeRepository.findAllByMemberIdWithMenu(currentMember.id()).stream()
        .map(MyRecipeListResponseDto::from)
        .toList();
  }

  // 내 포션 하나. 없거나 남의 포션이면 404 (남의 포션이 있는지조차 알려 주지 않는다)
  @Override
  public MyRecipeDetailResponseDto getDetail(Long id) {
    return recipeRepository.findByIdAndMemberIdWithMenu(id, currentMember.id())
        .map(MyRecipeDetailResponseDto::from)
        .orElseThrow(() -> new NotFoundException("포션을 찾을 수 없습니다: " + id));
  }

  // 도감 상단 숫자. 비밀 레시피는 손님에게 보이는(visible) 것만 센다
  @Override
  public MyRecipeSummaryResponseDto getSummary() {
    Long memberId = currentMember.id();
    List<SecretRecipe> visible = secretRecipeRepository.findAllVisibleWithCategory();
    List<Long> foundIds = discoveryRepository.findAllByMemberId(memberId).stream()
        .map(SecretRecipeDiscovery::getSecretRecipe)
        .map(SecretRecipe::getId)
        .toList();

    long secretTotal = visible.size();
    long secretFound = visible.stream().filter(s -> foundIds.contains(s.getId())).count();
    long legendTotal = visible.stream().filter(s -> "legend".equals(s.getGrade())).count();
    long legendFound = visible.stream()
        .filter(s -> "legend".equals(s.getGrade()) && foundIds.contains(s.getId()))
        .count();
    int progressRate = secretTotal == 0 ? 0 : (int) (secretFound * 100 / secretTotal);

    return new MyRecipeSummaryResponseDto(
        recipeRepository.countByMemberId(memberId),
        secretFound, secretTotal, legendFound, legendTotal, progressRate);
  }
}
