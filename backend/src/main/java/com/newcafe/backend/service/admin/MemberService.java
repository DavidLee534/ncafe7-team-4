package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.member.MemberDetailResponseDto;
import com.newcafe.backend.dto.admin.member.MemberListRequestDto;
import com.newcafe.backend.dto.admin.member.MemberListResponseDto;
import com.newcafe.backend.dto.admin.member.MemberStatusRequestDto;
import com.newcafe.backend.dto.admin.member.MemberStatusResponseDto;
import com.newcafe.backend.dto.admin.member.MemberSummaryResponseDto;

import java.util.List;

// 관리자 회원 관리 업무. 구현체는 DfMemberService
// 회원은 스스로 가입하므로 관리자는 보고(목록·상세) 상태를 바꾸거나 지운다. 등록·수정은 없다
public interface MemberService {

  List<MemberListResponseDto> getList(MemberListRequestDto request);

  MemberSummaryResponseDto getSummary();

  MemberDetailResponseDto getDetail(Long id);

  MemberStatusResponseDto changeStatus(Long id, MemberStatusRequestDto request);

  void delete(Long id);
}
