package com.newcafe.backend.service.my;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.my.secretrecipe.MySecretRecipeDetailResponseDto;
import com.newcafe.backend.dto.my.secretrecipe.MySecretRecipeListResponseDto;
import com.newcafe.backend.entity.SecretRecipe;
import com.newcafe.backend.entity.SecretRecipeDiscovery;
import com.newcafe.backend.repository.MemberRepository;
import com.newcafe.backend.repository.SecretRecipeDiscoveryRepository;
import com.newcafe.backend.repository.SecretRecipeRepository;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 관리자 쪽 DfSecretRecipeService 와 클래스 이름이 같아서 빈 이름을 따로 붙인다
@Service("mySecretRecipeService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfSecretRecipeService implements SecretRecipeService {

  private final CurrentMember currentMember;
  private final SecretRecipeRepository secretRecipeRepository;
  private final SecretRecipeDiscoveryRepository discoveryRepository;
  private final MemberRepository memberRepository;

  // 손님에게 보이는(visible) 비밀 레시피 전체에 "내가 찾았는지"를 붙인다
  // 필터(전체·발견·미발견·전설)는 프론트에서 거른다 (데이터가 작고, 칩 옆 개수에 전체가 필요)
  @Override
  public List<MySecretRecipeListResponseDto> getList() {
    Map<Long, SecretRecipeDiscovery> mine = myDiscoveries();
    return secretRecipeRepository.findAllVisibleWithCategory().stream()
        .map(recipe -> MySecretRecipeListResponseDto.from(recipe, mine.get(recipe.getId())))
        .toList();
  }

  // 숨김(visible=false)이거나 없는 레시피면 404
  @Override
  public MySecretRecipeDetailResponseDto getDetail(Long id) {
    SecretRecipe recipe = secretRecipeRepository.findById(id)
        .filter(SecretRecipe::isVisible)
        .orElseThrow(() -> new NotFoundException("비밀 레시피를 찾을 수 없습니다: " + id));
    SecretRecipeDiscovery discovery = discoveryRepository
        .findByMemberIdAndSecretRecipeId(currentMember.id(), id)
        .orElse(null);
    return MySecretRecipeDetailResponseDto.from(recipe, discovery, customerRate(id));
  }

  // 이 레시피를 찾은 회원 비율(%). 분모는 관리자를 뺀 회원 수. 소수 첫째 자리까지
  private double customerRate(Long secretRecipeId) {
    long members = memberRepository.countByRole("member");
    if (members == 0) {
      return 0;
    }
    double rate = discoveryRepository.countBySecretRecipeId(secretRecipeId) * 100.0 / members;
    return Math.round(rate * 10) / 10.0;
  }

  // 레시피 id → 내 발견 기록
  private Map<Long, SecretRecipeDiscovery> myDiscoveries() {
    return discoveryRepository.findAllByMemberId(currentMember.id()).stream()
        .collect(Collectors.toMap(d -> d.getSecretRecipe().getId(), Function.identity()));
  }
}
