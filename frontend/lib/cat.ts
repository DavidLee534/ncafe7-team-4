// 고양이 카페 컨셉용 표시 정보. 데이터(Menu)는 그대로 두고 화면에서만 덧붙인다.
import type { Menu, MenuStatusCounts } from "./types";

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

// 오늘의 냥일지 — 최근 수정된 메뉴 순서 (대시보드용. 메뉴 목록은 백엔드에서 sort=updatedAt 으로 받는다)
export function recentlyUpdated(menus: Menu[], limit = 5): Menu[] {
  return [...menus].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit);
}

// 모카 점장의 보고 — 상태별 개수(백엔드 summary)로 문장을 만든다. 카테고리를 골랐으면 그 카테고리 개수를 넘긴다.
export function mokaReport(counts: Pick<MenuStatusCounts, "on" | "soldout">, categoryName?: string): string {
  return categoryName
    ? `${categoryName} 책장에는 판매 가능한 주문이 ${counts.on}개, 품절 메뉴가 ${counts.soldout}개 있다냥.`
    : `오늘 공방에는 판매 가능한 주문이 ${counts.on}개, 품절 메뉴가 ${counts.soldout}개 있다냥. 어떤 레시피책을 펼쳐 볼까냥?`;
}
