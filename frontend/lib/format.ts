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
