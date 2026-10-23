// 화면 표시용 변환.
import type { MenuStatus } from "./types";

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
