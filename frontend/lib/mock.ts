// 목업 데이터와 조회 함수. 백엔드를 연결할 때 이 함수들의 본문만 API 호출로 바꾸면 페이지는 그대로 쓸 수 있다.
import type { Category, Menu, MenuStatus } from "./types";

const CATEGORIES: Category[] = [
  { id: 1, name: "커피", engName: "Coffee", sortOrder: 1, visible: true, createdAt: "2026-08-01" },
  { id: 2, name: "티", engName: "Tea", sortOrder: 2, visible: true, createdAt: "2026-08-01" },
  { id: 3, name: "에이드 · 스무디", engName: "Ade & Smoothie", sortOrder: 3, visible: true, createdAt: "2026-08-01" },
  { id: 4, name: "디저트", engName: "Dessert", sortOrder: 4, visible: true, createdAt: "2026-08-01" },
  { id: 5, name: "시즌 한정", engName: "Seasonal", sortOrder: 5, visible: false, createdAt: "2026-09-20" },
];

const img = (slug: string) => `/images/menus/${slug}.svg`;

const MENUS: Menu[] = [
  { id: 1, korName: "아메리카노", engName: "Americano", categoryId: 1, price: 4000, description: "깔끔하고 진한 에스프레소에 물을 더한 기본 커피입니다.", image: img("americano"), status: "on", isNew: false, createdAt: "2026-08-15", updatedAt: "2026-09-01" },
  { id: 2, korName: "아이스 아메리카노", engName: "Iced Americano", categoryId: 1, price: 4000, description: "얼음 위에 에스프레소를 부어 시원하게 즐기는 아메리카노입니다.", image: img("iced-americano"), status: "on", isNew: false, createdAt: "2026-08-15", updatedAt: "2026-08-15" },
  { id: 3, korName: "카페라떼", engName: "Caffe Latte", categoryId: 1, price: 4500, description: "에스프레소에 부드럽게 스팀한 우유를 더한 대표 라떼입니다.", image: img("latte"), status: "on", isNew: false, createdAt: "2026-08-15", updatedAt: "2026-09-02" },
  { id: 4, korName: "카푸치노", engName: "Cappuccino", categoryId: 1, price: 4500, description: "풍성한 우유 거품과 에스프레소의 균형이 좋은 커피입니다.", image: img("cappuccino"), status: "on", isNew: false, createdAt: "2026-08-15", updatedAt: "2026-08-15" },
  { id: 5, korName: "바닐라 라떼", engName: "Vanilla Latte", categoryId: 1, price: 5000, description: "바닐라 시럽의 달콤함을 더한 라떼입니다.", image: img("vanilla-latte"), status: "soldout", isNew: false, createdAt: "2026-08-16", updatedAt: "2026-09-28" },
  { id: 6, korName: "얼그레이", engName: "Earl Grey", categoryId: 2, price: 4500, description: "베르가못 향이 은은한 홍차입니다.", image: img("earl-grey"), status: "on", isNew: false, createdAt: "2026-08-17", updatedAt: "2026-08-17" },
  { id: 7, korName: "녹차", engName: "Green Tea", categoryId: 2, price: 4500, description: "국내산 찻잎으로 우린 녹차입니다.", image: img("green-tea"), status: "on", isNew: false, createdAt: "2026-08-17", updatedAt: "2026-08-17" },
  { id: 8, korName: "레몬에이드", engName: "Lemonade", categoryId: 3, price: 5500, description: "생레몬을 짜 넣은 상큼한 에이드입니다.", image: img("lemonade"), status: "on", isNew: true, createdAt: "2026-09-10", updatedAt: "2026-09-10" },
  { id: 9, korName: "딸기 스무디", engName: "Strawberry Smoothie", categoryId: 3, price: 5800, description: "딸기를 듬뿍 갈아 만든 스무디입니다.", image: img("strawberry-smoothie"), status: "on", isNew: true, createdAt: "2026-09-12", updatedAt: "2026-09-12" },
  { id: 10, korName: "망고 스무디", engName: "Mango Smoothie", categoryId: 3, price: 5800, description: "달콤한 망고로 만든 스무디입니다.", image: img("mango-smoothie"), status: "hidden", isNew: false, createdAt: "2026-08-20", updatedAt: "2026-09-30" },
  { id: 11, korName: "뉴욕 치즈케이크", engName: "New York Cheesecake", categoryId: 4, price: 6200, description: "진하고 꾸덕한 뉴욕 스타일 치즈케이크입니다.", image: img("cheesecake"), status: "soldout", isNew: false, createdAt: "2026-08-18", updatedAt: "2026-10-01" },
  { id: 12, korName: "버터 크루아상", engName: "Butter Croissant", categoryId: 4, price: 3900, description: "버터 풍미가 가득한 크루아상입니다.", image: img("croissant"), status: "on", isNew: false, createdAt: "2026-08-18", updatedAt: "2026-08-18" },
];

// ===== 카테고리 =====

export function getCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategory(id: number): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

// 카테고리별 메뉴 수. 삭제 가능 여부(메뉴가 있으면 삭제 불가) 판단에도 쓴다.
export function countMenusByCategory(categoryId: number): number {
  return MENUS.filter((m) => m.categoryId === categoryId).length;
}

// ===== 메뉴 =====

export type MenuFilter = { categoryId?: number; status?: MenuStatus; keyword?: string };

export function getMenus(filter: MenuFilter = {}): Menu[] {
  const keyword = filter.keyword?.trim().toLowerCase();
  return MENUS.filter((m) => !filter.categoryId || m.categoryId === filter.categoryId)
    .filter((m) => !filter.status || m.status === filter.status)
    .filter(
      (m) => !keyword || m.korName.toLowerCase().includes(keyword) || m.engName.toLowerCase().includes(keyword),
    );
}

export function getMenu(id: number): Menu | undefined {
  return MENUS.find((m) => m.id === id);
}

export function countMenusByStatus(): Record<MenuStatus | "all", number> {
  return {
    all: MENUS.length,
    on: MENUS.filter((m) => m.status === "on").length,
    soldout: MENUS.filter((m) => m.status === "soldout").length,
    hidden: MENUS.filter((m) => m.status === "hidden").length,
  };
}
