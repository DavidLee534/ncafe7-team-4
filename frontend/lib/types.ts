// 관리자 화면이 다루는 데이터 모양. lib/adminApi.ts 가 백엔드 응답을 이 모양으로 바꿔 채운다.

export type Category = {
  id: number;
  name: string; // 화면에 보이는 이름 (예: 커피)
  engName: string; // 영문 이름 (예: Coffee)
  sortOrder: number; // 사용자 화면의 카테고리 탭 순서. 작을수록 앞
  visible: boolean; // false 면 사용자 화면에서 숨김
  createdAt: string;
};

export type MenuStatus = "on" | "soldout" | "hidden";

// 판매 상태별 메뉴 수 (all 은 전체)
export type MenuStatusCounts = Record<MenuStatus | "all", number>;

// 메뉴 화면의 카테고리 칩·선택 상자에 쓰는 카테고리 (백엔드 /admin/menus/categories)
export type MenuCategory = Pick<Category, "id" | "name"> & { menuCount: number };

export type Menu = {
  id: number;
  korName: string;
  engName: string;
  categoryId: number;
  categoryName?: string; // 백엔드 응답에 함께 온다. 카테고리가 없으면 비어 있음
  slug?: string; // 사용자 메뉴 상세 주소(/menus/{slug}). 상세 응답에만 온다
  emotionTags?: string[]; // 감정 연금술 추천 태그. 상세 응답에만 온다
  tasteTags?: string[];
  price: number;
  description: string;
  image: string | null; // public/ 아래 경로. 없으면 null
  status: MenuStatus;
  isNew: boolean; // 사용자 화면에 NEW 표시
  isSecret: boolean; // 비밀 레시피 — 관리자 목록에 ✦ 비밀 표시
  isRecommended: boolean; // 사장 추천 메뉴 — 관리자 메뉴 카탈로그 위쪽 추천 칸에 모인다 (백엔드 ownerRecommended)
  createdAt: string;
  updatedAt: string;
};

// 재료 종류 — base(기반 재료, 계열마다 필수 1개) / extra(추가 재료, 선반에서 골라 넣음)
export type IngredientType = "base" | "extra";

// 종류별 재료 수 (all 은 전체)
export type IngredientTypeCounts = Record<IngredientType | "all", number>;

export type Ingredient = {
  id: number;
  name: string; // 예: 바닐라
  type: IngredientType;
  shelf: string; // 기반 재료는 계열(예: 커피), 추가 재료는 선반(예: 시럽)
  price: number; // 추가 금액. 기반 재료는 보통 0
  color: string; // 포션 색 #RRGGBB
  effectTags: string[]; // 효과 태그 (예: ["활력", "상큼함"])
  modifier: string; // 이름 앞 수식어. 추가 재료에만 있고, 없으면 빈 문자열
  modifierPriority: number | null; // 수식어 우선순위. 클수록 이름 앞
  visible: boolean; // false 면 손님 화면의 재료 선반에서 숨김
  createdAt: string;
  updatedAt: string;
};

// 관리자 메인의 "처리할 주문" 한 줄 (결제 완료 상태)
export type AdminMainOrder = {
  id: number;
  orderNumber: string;
  pickupName: string;
  pickupType: string; // dine-in(매장) / takeout(포장)
  totalPrice: number;
  createdAt: string; // "2026-10-27 14:05"
};

// 관리자 메인 화면 데이터 (백엔드 GET /api/v1/admin)
export type AdminMain = {
  menus: MenuStatusCounts;
  ingredients: IngredientTypeCounts & { hidden: number };
  orders: { paid: number; brewing: number; ready: number; todayCount: number; todaySales: number };
  members: { all: number; active: number; suspended: number };
  categories: MenuCategory[];
  attentionMenus: Menu[]; // 품절 · 숨김 메뉴
  recentMenus: Menu[]; // 최근 수정 메뉴 5개
  pendingOrders: AdminMainOrder[]; // 오래 기다린 주문부터 5개
};
