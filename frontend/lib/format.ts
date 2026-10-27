// 화면 표시용 변환.
import type { IngredientType, MemberRole, MemberStatus, MenuStatus, OrderStatus } from "./types";

export function won(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

// 판매 상태 → 라벨과 m3-badge 색
export const MENU_STATUS: Record<MenuStatus, { label: string; color: "success" | "warning" | "neutral" }> = {
  on: { label: "판매 중", color: "success" },
  soldout: { label: "품절", color: "warning" },
  hidden: { label: "비공개", color: "neutral" },
};

// 감정 연금술 추천에 쓰는 메뉴 태그. 백엔드 검증(MenuTagRules)과 같은 목록, 각각 3개까지
export const MENU_EMOTION_TAGS = ["피곤함", "열정", "그리움", "울적함", "설렘", "긴장됨"] as const;
export const MENU_TASTE_TAGS = ["달콤한", "쌉싸름한", "상큼한", "고소한", "시원한", "따뜻한"] as const;

// 재료 종류 → 라벨과 m3-badge 색
export const INGREDIENT_TYPE: Record<IngredientType, { label: string; color: "primary" | "secondary" }> = {
  base: { label: "기반 재료", color: "primary" },
  extra: { label: "추가 재료", color: "secondary" },
};

// 재료가 놓이는 자리 (README "공통 재료 선반"). 기반 재료는 계열, 추가 재료는 선반
export const INGREDIENT_SHELVES: Record<IngredientType, string[]> = {
  base: ["커피", "논커피", "과일라떼", "티", "스무디", "프라페", "디저트", "푸드"],
  extra: ["시럽", "우유", "음료 토핑", "디저트 장식", "푸드 속재료", "티 블렌딩", "푸드 소스"],
};

// 효과 태그 7종. 동점일 때 이 순서로 효과 칭호를 정한다
export const EFFECT_TAGS = ["활력", "진정", "달콤함", "상큼함", "고소함", "든든함", "시원함"];

// 주문 상태 → 라벨과 m3-badge 색
export const ORDER_STATUS: Record<OrderStatus, { label: string; color: "primary" | "warning" | "success" | "neutral" | "danger" }> = {
  ordered: { label: "접수 완료", color: "primary" },
  paid: { label: "결제 완료", color: "primary" },
  brewing: { label: "제조 중", color: "warning" },
  ready: { label: "제조 완료", color: "success" },
  done: { label: "수령 완료", color: "neutral" },
  cancelled: { label: "취소", color: "danger" },
};

// 지금 상태에서 넘어갈 다음 단계와 버튼 이름. 취소는 제조 시작 전까지 가능하다.
export const ORDER_NEXT_STEP: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  ordered: { status: "brewing", label: "제조 시작" },
  paid: { status: "brewing", label: "제조 시작" },
  brewing: { status: "ready", label: "제조 완료" },
  ready: { status: "done", label: "수령 완료" },
};

export const PICKUP_TYPE: Record<string, string> = { "dine-in": "매장", takeout: "포장" };

export const PAYMENT_METHOD: Record<string, string> = { card: "카드", easy: "간편결제", transfer: "계좌이체" };

// 회원 상태 · 역할 → 라벨과 m3-badge 색
export const MEMBER_STATUS: Record<MemberStatus, { label: string; color: "success" | "danger" }> = {
  active: { label: "정상", color: "success" },
  suspended: { label: "정지", color: "danger" },
};

export const MEMBER_ROLE: Record<MemberRole, string> = { member: "회원", admin: "관리자" };
