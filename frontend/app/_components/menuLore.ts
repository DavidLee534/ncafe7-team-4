import type { Menu } from "@/lib/types";
import { basicMenuEffects, basicMenus } from "../menu/_components/alchemyMenus";

export type MenuLore = { magicName: string; grade: "일반" | "희귀" | "전설"; effects: string[] };

const loreByMenuName: Record<string, MenuLore> = {
  "아메리카노": { magicName: "칠흑 고양이의 물약", grade: "일반", effects: ["활력 +2", "진한 향"] },
  "아이스 아메리카노": { magicName: "새벽 수염의 물약", grade: "일반", effects: ["청량 +2", "활력 +1"] },
  "카페라떼": { magicName: "빛과 어둠의 균형 포션", grade: "희귀", effects: ["부드러움 +2", "달콤함 +1"] },
  "카푸치노": { magicName: "구름 발바닥 물약", grade: "일반", effects: ["포근함 +2", "활력 +1"] },
  "바닐라 라떼": { magicName: "별빛 바닐라 포션", grade: "희귀", effects: ["달콤함 +2", "행운 +1"] },
  "얼그레이": { magicName: "귀족 고양이의 달임", grade: "일반", effects: ["차분함 +2", "맑음 +1"] },
  "녹차": { magicName: "초록 수풀 달임", grade: "일반", effects: ["맑음 +2", "휴식 +1"] },
  "레몬에이드": { magicName: "달빛 열매 포션", grade: "희귀", effects: ["상큼함 +2", "기분전환 +1"] },
  "딸기 스무디": { magicName: "장미 정령의 진액", grade: "희귀", effects: ["설렘 +2", "달콤함 +1"] },
  "망고 스무디": { magicName: "태양 정령의 진액", grade: "희귀", effects: ["햇살 +2", "활력 +1"] },
  "뉴욕 치즈케이크": { magicName: "마법진 케이크", grade: "희귀", effects: ["포근함 +2", "행운 +1"] },
  "버터 크루아상": { magicName: "초승달 빵", grade: "일반", effects: ["따뜻함 +2", "든든함 +1"] },
};

// 기본 메뉴 30종 — 기본 이름(예: 다크 로스트 커피)으로 찾는다. 효과는 README 재료 마스터의 효과 태그.
const loreByBasicMenu: Record<string, MenuLore> = Object.fromEntries(
  basicMenus.map((menu) => [menu.base, { magicName: menu.name, grade: "일반", effects: basicMenuEffects(menu) }]),
);

export const getMenuLore = (menu: Menu) => loreByBasicMenu[menu.korName] ?? loreByMenuName[menu.korName];
