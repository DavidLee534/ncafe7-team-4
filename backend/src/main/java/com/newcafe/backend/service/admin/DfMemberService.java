package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.member.MemberDetailResponseDto;
import com.newcafe.backend.dto.admin.member.MemberListRequestDto;
import com.newcafe.backend.dto.admin.member.MemberListResponseDto;
import com.newcafe.backend.dto.admin.member.MemberStatusRequestDto;
import com.newcafe.backend.dto.admin.member.MemberStatusResponseDto;
import com.newcafe.backend.dto.admin.member.MemberSummaryResponseDto;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.repository.CartItemRepository;
import com.newcafe.backend.repository.MemberRepository;
import com.newcafe.backend.repository.OrderRepository;
import com.newcafe.backend.repository.PotionShowcaseRepository;
import com.newcafe.backend.repository.RecipeRepository;
import com.newcafe.backend.repository.SecretRecipeDiscoveryRepository;
import com.newcafe.backend.repository.ShowcaseRatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfMemberService implements MemberService {

  private final MemberRepository memberRepository;
  private final OrderRepository orderRepository;
  private final RecipeRepository recipeRepository;
  private final PotionShowcaseRepository potionShowcaseRepository;
  private final CartItemRepository cartItemRepository;
  private final SecretRecipeDiscoveryRepository secretRecipeDiscoveryRepository;
  private final ShowcaseRatingRepository showcaseRatingRepository;

  // 빈 문자열 조건(?keyword=)은 조건 없음(null)으로 바꿔서 넘긴다. 가입순(id)
  @Override
  public List<MemberListResponseDto> getList(MemberListRequestDto request) {
    return memberRepository.findAllByCondition(
            blankToNull(request.keyword()),
            blankToNull(request.status()),
            blankToNull(request.role()),
            Sort.by("id"))
        .stream()
        .map(MemberListResponseDto::from)
        .toList();
  }

  // 회원을 상태별로 센다
  @Override
  public MemberSummaryResponseDto getSummary() {
    return new MemberSummaryResponseDto(
        memberRepository.count(),
        memberRepository.countByStatus("active"),
        memberRepository.countByStatus("suspended"));
  }

  // 회원 정보와 함께 주문 수·포션 수를 센다
  @Override
  public MemberDetailResponseDto getDetail(Long id) {
    Member member = findMember(id);
    return MemberDetailResponseDto.from(
        member,
        orderRepository.countByMemberId(id),
        recipeRepository.countByMemberId(id));
  }

  // 관리자 계정은 정지할 수 없다(409)
  // 조회한 회원의 값을 바꾸면 트랜잭션이 끝날 때 UPDATE 된다
  @Override
  @Transactional
  public MemberStatusResponseDto changeStatus(Long id, MemberStatusRequestDto request) {
    Member member = findMember(id);
    if ("admin".equals(member.getRole())) {
      throw new IllegalStateException("관리자 계정의 상태는 바꿀 수 없습니다: " + member.getEmail());
    }
    member.changeStatus(request.status());
    return MemberStatusResponseDto.from(member);
  }

  // 관리자 계정은 지울 수 없다(409)
  // 주문·포션·자랑글은 다른 사람도 보는 기록이라 남아 있으면 지울 수 없다(409) → 대신 정지(suspended)로 바꾼다
  // 장바구니·비밀 레시피 발견 기록·준 별점은 그 회원만의 데이터라 회원과 함께 지운다
  @Override
  @Transactional
  public void delete(Long id) {
    Member member = findMember(id);
    if ("admin".equals(member.getRole())) {
      throw new IllegalStateException("관리자 계정은 삭제할 수 없습니다: " + member.getEmail());
    }
    if (orderRepository.countByMemberId(id) > 0
        || recipeRepository.countByMemberId(id) > 0
        || potionShowcaseRepository.existsByMemberId(id)) {
      throw new IllegalStateException("주문·포션·자랑글이 있는 회원은 삭제할 수 없습니다. 회원 상태를 정지로 바꾸세요: " + member.getEmail());
    }
    cartItemRepository.deleteAllByMemberId(id);
    secretRecipeDiscoveryRepository.deleteAllByMemberId(id);
    showcaseRatingRepository.deleteAllByMemberId(id);
    memberRepository.delete(member);
  }

  // 없는 id면 NotFoundException(404)
  private Member findMember(Long id) {
    return memberRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다: " + id));
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }
}
