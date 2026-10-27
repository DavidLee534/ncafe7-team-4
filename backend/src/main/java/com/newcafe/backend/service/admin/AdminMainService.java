package com.newcafe.backend.service.admin;

import com.newcafe.backend.dto.admin.main.AdminMainResponseDto;

// 관리자 메인(대시보드) 업무. 구현체는 DfAdminMainService
// 다른 관리자 시스템의 숫자와 최근 항목을 모아 화면 한 장 분량으로 돌려준다
public interface AdminMainService {

  AdminMainResponseDto getMain();
}
