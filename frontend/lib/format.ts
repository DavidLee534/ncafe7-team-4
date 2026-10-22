// 화면 표시용 변환.
import type { IngredientType, MenuStatus } from "./types";

export function won(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

// 판매 상태 → 라벨과 m3-badge 색
export const MENU_STATUS: Record<MenuStatus, { label: string; color: "success" | "warning" | "neutral" }> = {
  on: { label: "판매 중", color: "success" },
  soldout: { label: "품절", color: "warning" },
  hidden: { label: "비공개", color: "neutral" },
};

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
