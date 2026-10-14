// 레시피 도감 데이터. 지금은 목업이고, 백엔드를 연결하면 아래 get 함수의 본문만
// API 호출(secret_recipe, member_collection)로 바꾸면 페이지는 그대로 쓸 수 있다.

export type PotionGroup = "커피" | "논커피" | "과일라떼" | "티" | "스무디" | "프라페" | "디저트" | "푸드";

// 기본 포션: 메뉴 30종을 연금술 이름으로 부른 것. 한 번 연성하면 도감에 기록된다.
export type BasicPotion = {
  kind: "basic";
  no: number;
  group: PotionGroup;
  name: string; // 연금술 이름 (예: 칠흑 고양이의 물약)
  baseName: string; // 실제 메뉴 이름 (예: 다크 로스트 커피)
  price: number;
  description: string;
  color: string; // 병 속 물약 색
  foundAt: string | null; // 처음 연성한 날. null 이면 아직 연성 안 함
  customerRate: number; // 이 포션을 연성해 본 손님 비율(%)
};

export type SecretGrade = "rare" | "legend";

// 비밀 레시피: 연금 공방에서 정해진 재료 조합을 맞히면 열린다.
export type SecretRecipe = {
  kind: "secret";
  no: number;
  name: string;
  grade: SecretGrade;
  group: PotionGroup;
  ingredients: string[];
  color: string;
  description: string;
  riddle: string; // 잠겨 있을 때 보여 주는 모카 점장의 수수께끼
  foundAt: string | null;
  customerRate: number; // 이 레시피를 찾은 손님 비율(%)
  proposal: boolean; // true = 새로 추가한 레시피 (9~12번). 팀 확인 후 확정
};

export type CodexEntry = BasicPotion | SecretRecipe;

const GROUP_COLOR: Record<PotionGroup, string> = {
  커피: "#6b4a35",
  논커피: "#8a5a3c",
  과일라떼: "#e98aa5",
  티: "#c79a4a",
  스무디: "#d0607a",
  프라페: "#9a7055",
  디저트: "#e3b25a",
  푸드: "#c99a62",
};

export const POTION_GROUPS = Object.keys(GROUP_COLOR) as PotionGroup[];

// [계열, 연금술 이름, 메뉴 이름, 가격, 설명] — 메뉴 30종
const BASIC_ROWS: [PotionGroup, string, string, number, string][] = [
  ["커피", "칠흑 고양이의 물약", "다크 로스트 커피", 4000, "한밤중 검은 고양이의 눈빛을 닮은 한 잔이에요."],
  ["커피", "새벽 수염의 물약", "라이트 로스트 커피", 4000, "새벽 첫 햇살에 수염을 적신 고양이가 즐기는 커피예요."],
  ["커피", "잠든 고양이의 물약", "디카페인 커피", 4300, "밤늦게 마셔도 고양이처럼 푹 잘 수 있는 물약이에요."],
  ["논커피", "검은 숲의 물약", "초코 라떼", 5000, "깊은 숲의 그늘에서 길어 올린 진한 물약이에요."],
  ["논커피", "숲의 숨결", "말차 라떼", 5000, "이끼 낀 숲이 내쉬는 숨을 담은 초록빛 한 잔이에요."],
  ["논커피", "노을 뿌리 물약", "고구마 라떼", 5000, "노을빛 땅속에서 캐낸 뿌리로 끓인 물약이에요."],
  ["논커피", "들판의 축복", "곡물 라떼", 5000, "가을 들판의 곡식을 모아 축복을 빌며 만들었어요."],
  ["과일라떼", "분홍 고양이 포션", "딸기 라떼", 5500, "마시면 볼이 분홍빛으로 물드는 포션이에요."],
  ["과일라떼", "달빛 열매 포션", "블루베리 라떼", 5500, "달빛 아래에서만 익는 열매로 만든 보랏빛 포션이에요."],
  ["과일라떼", "황금 열매 포션", "망고 라떼", 5500, "황금빛으로 빛나는 남쪽 열매의 포션이에요."],
  ["티", "귀족 고양이의 달임", "얼그레이 티", 4500, "기품 있는 귀족 고양이가 오후마다 즐기는 차예요."],
  ["티", "잠드는 꼬리", "캐모마일 티", 4500, "한 모금이면 꼬리가 스르르 말려 잠드는 차예요."],
  ["티", "붉은 마녀의 달임", "히비스커스 티", 4500, "붉은 마녀가 몰래 우려 마시던 루비빛 차예요."],
  ["티", "초록 수풀 달임", "녹차", 4500, "비 갠 뒤 초록 수풀의 향을 그대로 담았어요."],
  ["스무디", "장미 정령의 진액", "딸기 스무디", 5800, "장미 정원의 정령이 건네준 붉은 진액이에요."],
  ["스무디", "태양 정령의 진액", "망고 스무디", 5800, "한여름 태양 정령의 기운을 얼려 담았어요."],
  ["스무디", "햇살 꼬리 정령의 진액", "바나나 스무디", 5800, "햇살처럼 노란 꼬리를 가진 정령의 진액이에요."],
  ["스무디", "밤하늘 정령의 진액", "블루베리 스무디", 5800, "밤하늘 정령이 별빛을 섞어 만든 진액이에요."],
  ["프라페", "얼어붙은 밤 엘릭서", "모카 프라페", 6000, "겨울밤을 통째로 얼린 듯한 엘릭서예요."],
  ["프라페", "눈보라 엘릭서", "쿠키앤크림 프라페", 6000, "쿠키 조각이 눈보라처럼 흩날리는 엘릭서예요."],
  ["프라페", "서리숲 엘릭서", "녹차 프라페", 6000, "서리가 내려앉은 초록 숲의 엘릭서예요."],
  ["프라페", "호박빛 빙하 엘릭서", "카라멜 프라페", 6000, "호박빛으로 빛나는 빙하를 깎아 만든 엘릭서예요."],
  ["디저트", "마법진 케이크", "조각 케이크", 6500, "크림 위에 그린 마법진이 행운을 불러오는 케이크예요."],
  ["디저트", "격자 결계 와플", "와플", 5500, "격자무늬 결계가 달콤함을 가둬 두었어요."],
  ["디저트", "황금 비늘 과자", "크로플", 5500, "황금빛 비늘처럼 겹겹이 구운 과자예요."],
  ["디저트", "요정의 동전", "마카롱", 4000, "숲속 요정들이 물건을 살 때 쓰는 동전이에요."],
  ["푸드", "초승달 빵", "크루아상", 5000, "초승달이 뜨는 밤에 구워 낸 빵이에요."],
  ["푸드", "떠돌이 기사의 빵", "치아바타 샌드위치", 7000, "먼 길을 떠나는 기사가 챙기는 든든한 빵이에요."],
  ["푸드", "고리 부적 빵", "베이글", 4500, "행운을 지켜 주는 고리 모양 부적 빵이에요."],
  ["푸드", "모닥불 토스트", "토스트", 4500, "모닥불 앞에서 노릇하게 구운 모험가의 아침이에요."],
];

// 목업: 로그인한 손님이 연성해 본 포션 (인덱스 → 날짜)
const BASIC_FOUND: Record<number, string> = {
  0: "2026-10-07", 1: "2026-10-09", 3: "2026-10-07", 4: "2026-10-11", 7: "2026-10-13", 10: "2026-10-08",
  11: "2026-10-12", 14: "2026-10-10", 18: "2026-10-09", 22: "2026-10-07", 26: "2026-10-11", 29: "2026-10-13",
};
const BASIC_RATE = [88, 61, 34, 79, 72, 41, 38, 83, 57, 64, 52, 69, 47, 44, 75, 71, 49, 46, 66, 74, 39, 58, 81, 63, 55, 59, 70, 48, 42, 52];

const BASIC_POTIONS: BasicPotion[] = BASIC_ROWS.map(([group, name, baseName, price, description], i) => ({
  kind: "basic",
  no: i + 1,
  group,
  name,
  baseName,
  price,
  description,
  color: GROUP_COLOR[group],
  foundAt: BASIC_FOUND[i] ?? null,
  customerRate: BASIC_RATE[i],
}));

// 1~8번은 기존 비밀 레시피, 9~12번은 계열을 채우기 위해 새로 추가한 레시피(proposal)
const SECRET_RECIPES: SecretRecipe[] = [
  { name: "대연금술사의 황금 꼬리", grade: "legend", group: "커피", ingredients: ["다크 로스트", "캐러멜", "오트", "마시멜로"], color: "#d9a03c", description: "은퇴한 대연금술사 모카 사장님이 처음 완성한 포션이에요.", riddle: "가장 진한 원두에 달콤한 것 둘, 곡식의 우유 하나. 내가 처음 빚은 맛이다냥.", foundAt: null, customerRate: 2.1 },
  { name: "빛과 어둠의 균형 포션", grade: "rare", group: "커피", ingredients: ["다크 로스트", "바닐라"], color: "#8a6a4f", description: "빛과 어둠이 한 잔 안에서 균형을 이루는 포션이에요.", riddle: "검은 원두에 하얀 꽃의 향 하나면 된다냥.", foundAt: "2026-10-08", customerRate: 18.4 },
  { name: "바다 사냥꾼 식량", grade: "rare", group: "푸드", ingredients: ["베이글", "연어", "크림치즈"], color: "#e48b6a", description: "바다를 건너는 고양이 사냥꾼의 든든한 식량이에요.", riddle: "고리 부적 빵에 바다의 분홍 살, 하얀 치즈를 바르라냥.", foundAt: "2026-10-10", customerRate: 12.7 },
  { name: "백 년 잠의 자장가", grade: "rare", group: "티", ingredients: ["캐모마일", "꿀", "라벤더"], color: "#a990d6", description: "한 모금이면 백 년 동안 잠들 것 같은 포근함이에요.", riddle: "잠드는 꽃잎에 벌의 선물, 보랏빛 들꽃 한 줌이다냥.", foundAt: "2026-10-12", customerRate: 9.3 },
  { name: "붉은 마녀의 비밀 서약", grade: "rare", group: "티", ingredients: ["히비스커스", "자몽청", "로즈마리"], color: "#c9405a", description: "붉은 마녀가 숲 기사와 몰래 맺은 서약의 차예요.", riddle: "붉은 꽃잎에 쌉쌀한 열매청, 그리고 기사가 아끼던 허브 한 줄기다냥.", foundAt: null, customerRate: 6.8 },
  { name: "별을 삼킨 밤의 정령", grade: "rare", group: "스무디", ingredients: ["블루베리 스무디", "요거트", "꿀"], color: "#4f5fb8", description: "밤하늘의 별을 한입에 삼킨 정령의 진액이에요.", riddle: "밤하늘 열매를 갈아 하얀 구름을 얹고, 꿀 한 스푼으로 별을 녹여라냥.", foundAt: null, customerRate: 11.2 },
  { name: "다람쥐 왕의 보물 상자", grade: "rare", group: "디저트", ingredients: ["와플", "아이스크림", "캐러멜 소스", "견과류"], color: "#c98a4a", description: "숲속 다람쥐 왕이 숨겨 둔 달콤한 보물 상자예요.", riddle: "격자 상자 위에 차가운 눈, 흐르는 금빛, 그리고 다람쥐가 모으는 것이다냥.", foundAt: null, customerRate: 7.5 },
  { name: "용 사냥꾼의 보급품", grade: "legend", group: "푸드", ingredients: ["치아바타", "아보카도", "에그", "스리라차 마요"], color: "#6f9a4a", description: "용을 잡으러 떠나는 기사만 받을 수 있는 보급품이에요.", riddle: "기사의 빵에 숲의 버터와 해를 닮은 것, 마지막엔 용의 불꽃 같은 소스다냥.", foundAt: null, customerRate: 1.4 },
  { name: "모닥불 곁의 겨울잠", grade: "rare", group: "논커피", ingredients: ["고구마", "시나몬", "마시멜로"], color: "#c9774a", description: "모닥불 앞에서 겨울잠에 드는 곰도 깨우는 달콤한 물약이에요.", riddle: "노을빛 뿌리에 따뜻한 나무껍질 가루, 구름처럼 녹는 것 하나다냥.", foundAt: null, customerRate: 14.9 },
  { name: "분홍 구름 위의 낮잠", grade: "rare", group: "과일라떼", ingredients: ["딸기청", "오트", "휘핑"], color: "#ec8fae", description: "분홍 구름 위에서 낮잠을 자는 기분을 담았어요.", riddle: "분홍 열매청에 곡식의 우유, 그 위에 구름을 듬뿍 얹어라냥.", foundAt: "2026-10-13", customerRate: 21.6 },
  { name: "모카 점장의 한밤 야식", grade: "rare", group: "프라페", ingredients: ["모카", "헤이즐넛", "초코칩"], color: "#6a4a3c", description: "모카 점장이 공방 문을 닫고 몰래 만들어 먹는 한밤의 야식이에요.", riddle: "얼어붙은 밤에 고소한 열매 시럽, 그리고 검은 조각들을 뿌려라냥.", foundAt: null, customerRate: 10.1 },
  { name: "요정 여왕의 첫 금화", grade: "legend", group: "디저트", ingredients: ["마카롱", "베리 소스", "생크림"], color: "#d65f8c", description: "요정 여왕이 처음 만든 금화라 아무에게나 보이지 않아요.", riddle: "요정의 동전에 붉은 열매 소스와 하얀 크림을 바른 것이다냥.", foundAt: null, customerRate: 2.8 },
].map((recipe, i) => ({ ...recipe, kind: "secret" as const, grade: recipe.grade as SecretGrade, group: recipe.group as PotionGroup, no: i + 1, proposal: i >= 8 }));

export function getBasicPotions(): BasicPotion[] {
  return BASIC_POTIONS;
}

export function getSecretRecipes(): SecretRecipe[] {
  return SECRET_RECIPES;
}
