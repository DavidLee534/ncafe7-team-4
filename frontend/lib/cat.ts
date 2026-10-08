// 고양이 카페 컨셉용 표시 정보. 데이터(Menu)는 그대로 두고 화면에서만 덧붙인다.
import type { Menu } from "./types";

// 담당 고양이 바리스타 — 메뉴 카드 오른쪽 위 아이콘.
// 지금은 메뉴 id 로 돌려 배정한다. 백엔드에 담당 필드가 생기면 그 값으로 바꾼다.
export const BARISTAS = [
  { name: "모찌", icon: "🐾" },
  { name: "치즈", icon: "🐟" },
  { name: "두부", icon: "🧶" },
] as const;

export function baristaOf(menu: Menu) {
  return BARISTAS[(menu.id - 1) % BARISTAS.length];
}

// 카드 왼쪽 위 코드: 1 → PAW-001
export function pawCode(id: number): string {
  return `PAW-${String(id).padStart(3, "0")}`;
}

// 오늘의 냥일지 — 최근 수정된 메뉴 순서
export function recentlyUpdated(menus: Menu[], limit = 5): Menu[] {
  return [...menus].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit);
}
