// 화면 표시용 변환.
import type { MemberRole, MemberStatus, MenuStatus, OrderStatus } from "./types";

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

// 주문 상태 → 라벨과 m3-badge 색
export const ORDER_STATUS: Record<OrderStatus, { label: string; color: "primary" | "warning" | "success" | "neutral" | "danger" }> = {
  paid: { label: "결제 완료", color: "primary" },
  brewing: { label: "제조 중", color: "warning" },
  ready: { label: "제조 완료", color: "success" },
  done: { label: "수령 완료", color: "neutral" },
  cancelled: { label: "취소", color: "danger" },
};

// 지금 상태에서 넘어갈 다음 단계와 버튼 이름. 규칙은 백엔드(Order.changeStatus)와 같다. 취소는 paid 에서만
export const ORDER_NEXT_STEP: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
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
