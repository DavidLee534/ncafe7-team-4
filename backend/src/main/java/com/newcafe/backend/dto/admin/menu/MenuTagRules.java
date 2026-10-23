package com.newcafe.backend.dto.admin.menu;

import java.util.List;

// 메뉴 등록·수정 요청에서 함께 쓰는 검증 규칙과 태그 변환
// 감정·맛 목록은 연금 공방 목업(frontend/app/menu/_components/alchemyMenus.ts)과 같다
final class MenuTagRules {

  private MenuTagRules() {
  }

  static final String SLUG = "^[a-z0-9]+(-[a-z0-9]+)*$";
  static final String EMOTIONS = "피곤함|열정|그리움|울적함|설렘|긴장됨";
  static final String TASTES = "달콤한|쌉싸름한|상큼한|고소한|시원한|따뜻한";

  // ["피곤함", "설렘"] → "피곤함,설렘". 빈 목록이면 null
  static String join(List<String> tags) {
    return tags == null || tags.isEmpty() ? null : String.join(",", tags);
  }
}
