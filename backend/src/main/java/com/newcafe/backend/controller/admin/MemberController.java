package com.newcafe.backend.controller.admin;

import com.newcafe.backend.dto.admin.member.MemberDetailResponseDto;
import com.newcafe.backend.dto.admin.member.MemberListRequestDto;
import com.newcafe.backend.dto.admin.member.MemberListResponseDto;
import com.newcafe.backend.dto.admin.member.MemberStatusRequestDto;
import com.newcafe.backend.dto.admin.member.MemberStatusResponseDto;
import com.newcafe.backend.dto.admin.member.MemberSummaryResponseDto;
import com.newcafe.backend.service.admin.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/members")
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;

  // 회원 목록. 쿼리스트링의 조건(?keyword=&status=&role=)으로 거른다. 조건이 없으면 전체
  @GetMapping
  public List<MemberListResponseDto> getList(@ModelAttribute MemberListRequestDto request) {
    return memberService.getList(request);
  }

  // 상태별 회원 수 (전체·정상·정지)
  @GetMapping("/summary")
  public MemberSummaryResponseDto getSummary() {
    return memberService.getSummary();
  }

  // 회원 상세 (주문 수·포션 수 포함). 없는 id면 404
  @GetMapping("/{id}")
  public MemberDetailResponseDto getDetail(@PathVariable Long id) {
    return memberService.getDetail(id);
  }

  // 회원 상태 변경 (정상 ↔ 정지). 상태 하나만 바꾸므로 PATCH. 관리자 계정이면 409
  @PatchMapping("/{id}/status")
  public MemberStatusResponseDto changeStatus(@PathVariable Long id, @Valid @RequestBody MemberStatusRequestDto request) {
    return memberService.changeStatus(id, request);
  }

  // 회원 삭제. 성공하면 본문 없이 204. 주문·포션·자랑글이 있거나 관리자 계정이면 409
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    memberService.delete(id);
  }
}
