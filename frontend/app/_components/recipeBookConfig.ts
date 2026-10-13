export type CategoryBook = {
  theme: string;
  icon: string;
  kicker: string;
  title: string;
  story: string;
  menuLabel: string;
};

export const CATEGORY_BOOKS: Record<number, CategoryBook> = {
  1: {
    theme: "coffee",
    icon: "☕",
    kicker: "EMBER & ESPRESSO",
    title: "황금 오븐의 커피 주문",
    story: "치즈 총괄 마법사가\n새벽의 불꽃으로 추출한 진한 주문이에요.",
    menuLabel: "에스프레소 마법사의 추천",
  },
  2: {
    theme: "tea",
    icon: "🍵",
    kicker: "HERB MOON INFUSION",
    title: "달빛 허브 티포트",
    story: "삼색이 허브 마법사가\n정원에서 고른 향긋한 잎을 우려요.",
    menuLabel: "허브 마법사의 추천",
  },
  3: {
    theme: "ade",
    icon: "🍹",
    kicker: "BUBBLE JELLY LAB",
    title: "반짝이는 젤리 물약",
    story: "톡톡 터지는 과일 젤리에\n달빛 탄산을 한 스푼 더했어요.",
    menuLabel: "젤리 물약 공방의 추천",
  },
  4: {
    theme: "dessert",
    icon: "🧁",
    kicker: "SWEET PAW PATISSERIE",
    title: "발바닥 디저트 상자",
    story: "턱시도 반죽 마법사의\n정교한 젤리 압력이 만든 달콤함이에요.",
    menuLabel: "디저트 공방의 추천",
  },
  5: {
    theme: "seasonal",
    icon: "🌙",
    kicker: "LIMITED MOONLIGHT SPELL",
    title: "계절 한정 비밀 주문",
    story: "보름달이 뜨는 밤에만\n펼쳐 볼 수 있는 한정 레시피예요.",
    menuLabel: "모카 점장의 한정 추천",
  },
};
