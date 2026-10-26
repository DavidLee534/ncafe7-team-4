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

// ===== 주문 =====

// paid(결제완료) → brewing(제조중) → ready(제조완료) → done(수령완료). paid 에서만 cancelled(취소)
export type OrderStatus = "paid" | "brewing" | "ready" | "done" | "cancelled";

// 상태별 주문 수 (all 은 전체) + 오늘 매출
export type OrderSummary = Record<OrderStatus | "all", number> & { todaySales: number };

// 주문 목록의 한 줄
export type Order = {
  id: number;
  orderNumber: string; // 화면에 보이는 주문번호 (예: NC261020-0001)
  status: OrderStatus;
  pickupName: string; // 포션이 나오면 불러 줄 이름
  pickupType: string; // dine-in(매장) / takeout(포장)
  itemCount: number; // 주문한 잔 수
  totalPrice: number;
  createdAt: string; // "2026-10-26 13:29"
};

// 주문 상세 — 목록 + 회원 · 요청 사항 · 항목 · 결제
export type OrderDetail = Omit<Order, "itemCount"> & {
  memberNickname: string;
  request: string;
  items: { itemType: string; name: string; options: string | null; unitPrice: number; quantity: number }[];
  payment: { method: string; detail: string | null; amount: number; approvalCode: string; paidAt: string } | null;
  updatedAt: string;
};

// ===== 회원 =====

export type MemberStatus = "active" | "suspended";
export type MemberRole = "member" | "admin";

// 상태별 회원 수 (all 은 전체)
export type MemberSummary = Record<MemberStatus | "all", number>;

// 회원 목록의 한 줄. 비밀번호는 백엔드가 보내지 않는다
export type Member = {
  id: number;
  email: string;
  nickname: string;
  role: MemberRole;
  status: MemberStatus;
  createdAt: string;
};

// 회원 상세 — 목록 + 주문 수 · 포션 수
export type MemberDetail = Member & {
  orderCount: number;
  recipeCount: number;
  updatedAt: string;
};
