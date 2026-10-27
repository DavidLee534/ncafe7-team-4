// 연금 공방의 기본 메뉴 30종과 감정 연금술 태그. 설명은 README 의 "기본 메뉴 30종" 표를 따른다.

export type Emotion = "피곤함" | "열정" | "그리움" | "울적함" | "설렘" | "긴장됨";
export type Taste = "달콤한" | "쌉싸름한" | "상큼한" | "고소한" | "시원한" | "따뜻한";

export const emotions: { name: Emotion; color: string }[] = [
  { name: "피곤함", color: "#91a8ff" }, { name: "열정", color: "#ff7359" }, { name: "그리움", color: "#d9a75c" },
  { name: "울적함", color: "#6f9fe8" }, { name: "설렘", color: "#ec7cab" }, { name: "긴장됨", color: "#76cf9b" },
];
export const tastes: Taste[] = ["달콤한", "쌉싸름한", "상큼한", "고소한", "시원한", "따뜻한"];

export type BasicMenu = { id?: number; category: string; name: string; base: string; ingredient: string; price: number; emotions: Emotion[]; tastes: Taste[]; effects: string[]; color: string; description: string }; // id 는 DB 메뉴 번호. ingredient 는 재료 연금술 선반의 기반 재료 이름.

// 기본 메뉴 30종 — 추가 재료 없이 기반 재료만 고른 포션. 감정 연금술 추천과 기본 메뉴 목록이 함께 쓴다.
export const basicMenus: BasicMenu[] = [
  { category: "커피", name: "칠흑 고양이의 물약", base: "다크 로스트 커피", ingredient: "다크 로스트", price: 4000, emotions: ["피곤함"], tastes: ["쌉싸름한", "따뜻한"], effects: ["활력"], color: "#3B2416", description: "한밤중 검은 고양이의 눈빛을 닮은 한 잔이에요. 진하게 볶은 원두로 내려 쌉싸름하고 묵직해요." },
  { category: "커피", name: "새벽 수염의 물약", base: "라이트 로스트 커피", ingredient: "라이트 로스트", price: 4000, emotions: ["피곤함", "설렘"], tastes: ["상큼한", "쌉싸름한"], effects: ["활력", "상큼함"], color: "#8B5A2B", description: "새벽 첫 햇살에 수염을 적신 고양이가 즐기는 커피예요. 가볍게 볶아 산뜻한 산미와 꽃향이 나요." },
  { category: "커피", name: "잠든 고양이의 물약", base: "디카페인 커피", ingredient: "디카페인", price: 4300, emotions: ["긴장됨"], tastes: ["쌉싸름한", "따뜻한"], effects: ["진정"], color: "#6F4E37", description: "밤늦게 마셔도 고양이처럼 푹 잘 수 있는 물약이에요. 카페인을 뺀 원두로 부드럽고 고소해요." },
  { category: "논커피", name: "검은 숲의 물약", base: "초코 라떼", ingredient: "초코", price: 5000, emotions: ["울적함"], tastes: ["달콤한", "따뜻한"], effects: ["달콤함"], color: "#5C3A21", description: "깊은 숲의 그늘에서 길어 올린 진한 물약이에요. 진한 초콜릿에 따뜻한 우유를 더했어요." },
  { category: "논커피", name: "숲의 숨결", base: "말차 라떼", ingredient: "말차", price: 5000, emotions: ["긴장됨"], tastes: ["쌉싸름한", "고소한"], effects: ["활력", "진정"], color: "#7BA05B", description: "이끼 낀 숲이 내쉬는 숨을 담은 초록빛 한 잔이에요. 쌉싸름한 말차와 우유가 부드럽게 어우러져요." },
  { category: "논커피", name: "노을 뿌리 물약", base: "고구마 라떼", ingredient: "고구마", price: 5000, emotions: ["그리움"], tastes: ["고소한", "달콤한", "따뜻한"], effects: ["달콤함", "든든함"], color: "#C98B5E", description: "노을빛 땅속에서 캐낸 뿌리로 끓인 물약이에요. 군고구마처럼 달콤하고 포근한 라떼예요." },
  { category: "논커피", name: "들판의 축복", base: "곡물 라떼", ingredient: "곡물", price: 5000, emotions: ["그리움"], tastes: ["고소한", "따뜻한"], effects: ["고소함", "든든함"], color: "#D8C3A5", description: "가을 들판의 곡식을 모아 축복을 빌며 만들었어요. 미숫가루처럼 고소하고 든든한 라떼예요." },
  { category: "과일라떼", name: "분홍 고양이 포션", base: "딸기 라떼", ingredient: "딸기청", price: 5500, emotions: ["설렘"], tastes: ["달콤한", "시원한"], effects: ["상큼함", "달콤함"], color: "#F4A6B7", description: "마시면 볼이 분홍빛으로 물드는 포션이에요. 딸기청과 우유로 만든 새콤달콤한 라떼예요." },
  { category: "과일라떼", name: "달빛 열매 포션", base: "블루베리 라떼", ingredient: "블루베리청", price: 5500, emotions: ["설렘", "울적함"], tastes: ["상큼한", "달콤한"], effects: ["상큼함"], color: "#7B6CC2", description: "달빛 아래에서만 익는 열매로 만든 보랏빛 포션이에요. 블루베리청과 우유가 상큼하게 어울려요." },
  { category: "과일라떼", name: "황금 열매 포션", base: "망고 라떼", ingredient: "망고청", price: 5500, emotions: ["열정"], tastes: ["달콤한", "시원한"], effects: ["달콤함"], color: "#F6B64A", description: "황금빛으로 빛나는 남쪽 열매의 포션이에요. 진한 망고청과 우유로 달콤하고 부드러워요." },
  { category: "티", name: "귀족 고양이의 달임", base: "얼그레이 티", ingredient: "얼그레이", price: 4500, emotions: ["그리움"], tastes: ["쌉싸름한", "따뜻한"], effects: ["활력"], color: "#A4573A", description: "기품 있는 귀족 고양이가 오후마다 즐기는 차예요. 베르가못 향이 은은한 홍차예요." },
  { category: "티", name: "잠드는 꼬리", base: "캐모마일 티", ingredient: "캐모마일", price: 4500, emotions: ["긴장됨", "피곤함"], tastes: ["따뜻한"], effects: ["진정"], color: "#E9D27A", description: "한 모금이면 꼬리가 스르르 말려 잠드는 차예요. 사과향이 나는 캐모마일로 마음이 편안해져요." },
  { category: "티", name: "붉은 마녀의 달임", base: "히비스커스 티", ingredient: "히비스커스", price: 4500, emotions: ["열정"], tastes: ["상큼한", "따뜻한"], effects: ["상큼함"], color: "#B3263E", description: "붉은 마녀가 몰래 우려 마시던 루비빛 차예요. 새콤한 히비스커스로 산뜻하게 즐겨요." },
  { category: "티", name: "초록 수풀 달임", base: "녹차", ingredient: "녹차", price: 4500, emotions: ["긴장됨"], tastes: ["쌉싸름한", "따뜻한"], effects: ["진정"], color: "#A8C686", description: "비 갠 뒤 초록 수풀의 향을 그대로 담았어요. 맑고 깔끔한 녹차예요." },
  { category: "스무디", name: "장미 정령의 진액", base: "딸기 스무디", ingredient: "딸기", price: 5800, emotions: ["설렘"], tastes: ["상큼한", "시원한", "달콤한"], effects: ["상큼함", "시원함"], color: "#E8505B", description: "장미 정원의 정령이 건네준 붉은 진액이에요. 딸기를 통째로 갈아 시원하고 새콤달콤해요." },
  { category: "스무디", name: "태양 정령의 진액", base: "망고 스무디", ingredient: "망고", price: 5800, emotions: ["열정"], tastes: ["달콤한", "시원한"], effects: ["달콤함", "시원함"], color: "#FFB627", description: "한여름 태양 정령의 기운을 얼려 담았어요. 망고를 갈아 진하고 달콤한 스무디예요." },
  { category: "스무디", name: "햇살 꼬리 정령의 진액", base: "바나나 스무디", ingredient: "바나나", price: 5800, emotions: ["피곤함", "울적함"], tastes: ["달콤한", "고소한", "시원한"], effects: ["든든함", "달콤함"], color: "#F3E07A", description: "햇살처럼 노란 꼬리를 가진 정령의 진액이에요. 바나나를 갈아 부드럽고 든든해요." },
  { category: "스무디", name: "밤하늘 정령의 진액", base: "블루베리 스무디", ingredient: "블루베리", price: 5800, emotions: ["울적함"], tastes: ["상큼한", "시원한"], effects: ["상큼함", "시원함"], color: "#4B3F8C", description: "밤하늘 정령이 별빛을 섞어 만든 진액이에요. 블루베리를 갈아 새콤하고 시원해요." },
  { category: "프라페", name: "얼어붙은 밤 엘릭서", base: "모카 프라페", ingredient: "모카", price: 6000, emotions: ["피곤함"], tastes: ["달콤한", "쌉싸름한", "시원한"], effects: ["시원함", "활력"], color: "#6B4630", description: "겨울밤을 통째로 얼린 듯한 엘릭서예요. 커피와 초콜릿을 얼음과 함께 간 시원한 모카 프라페예요." },
  { category: "프라페", name: "눈보라 엘릭서", base: "쿠키앤크림 프라페", ingredient: "쿠키앤크림", price: 6000, emotions: ["설렘"], tastes: ["달콤한", "시원한"], effects: ["시원함", "달콤함"], color: "#D9D4CC", description: "쿠키 조각이 눈보라처럼 흩날리는 엘릭서예요. 초코 쿠키와 크림을 얼음과 함께 갈았어요." },
  { category: "프라페", name: "서리숲 엘릭서", base: "녹차 프라페", ingredient: "녹차", price: 6000, emotions: ["열정"], tastes: ["쌉싸름한", "시원한"], effects: ["시원함", "진정"], color: "#9CC08A", description: "서리가 내려앉은 초록 숲의 엘릭서예요. 녹차를 얼음과 함께 갈아 시원하고 쌉싸름해요." },
  { category: "프라페", name: "호박빛 빙하 엘릭서", base: "카라멜 프라페", ingredient: "카라멜", price: 6000, emotions: ["울적함"], tastes: ["달콤한", "시원한"], effects: ["시원함", "달콤함"], color: "#D29A4E", description: "호박빛으로 빛나는 빙하를 깎아 만든 엘릭서예요. 달콤한 카라멜을 얼음과 함께 갈았어요." },
  { category: "디저트", name: "마법진 케이크", base: "조각 케이크", ingredient: "조각 케이크", price: 6500, emotions: ["설렘"], tastes: ["달콤한"], effects: ["달콤함"], color: "#F7E7CE", description: "크림 위에 그린 마법진이 행운을 불러오는 케이크예요. 촉촉한 시트와 생크림을 겹겹이 쌓은 조각 케이크예요." },
  { category: "디저트", name: "격자 결계 와플", base: "와플", ingredient: "와플", price: 5500, emotions: ["울적함"], tastes: ["달콤한", "따뜻한"], effects: ["달콤함", "든든함"], color: "#D9A35B", description: "격자무늬 결계가 달콤함을 가둬 두었어요. 겉은 바삭하고 속은 폭신한 와플이에요." },
  { category: "디저트", name: "황금 비늘 과자", base: "크로플", ingredient: "크로플", price: 5500, emotions: ["그리움", "열정"], tastes: ["달콤한", "고소한"], effects: ["달콤함"], color: "#C8873A", description: "황금빛 비늘처럼 겹겹이 구운 과자예요. 크루아상 반죽을 와플 틀에 눌러 구워 바삭해요." },
  { category: "디저트", name: "요정의 동전", base: "마카롱", ingredient: "마카롱", price: 4000, emotions: ["설렘"], tastes: ["달콤한", "상큼한"], effects: ["달콤함"], color: "#F5B7C5", description: "숲속 요정들이 물건을 살 때 쓰는 동전이에요. 쫀득한 마카롱 두 개가 한 세트예요." },
  { category: "푸드", name: "초승달 빵", base: "크루아상", ingredient: "크루아상", price: 5000, emotions: ["그리움"], tastes: ["고소한"], effects: ["고소함"], color: "#D9A35B", description: "초승달이 뜨는 밤에 구워 낸 빵이에요. 버터 향 가득한 결 살아 있는 크루아상이에요." },
  { category: "푸드", name: "떠돌이 기사의 빵", base: "치아바타 샌드위치", ingredient: "치아바타", price: 7000, emotions: ["피곤함", "열정"], tastes: ["고소한"], effects: ["든든함"], color: "#C9A66B", description: "먼 길을 떠나는 기사가 챙기는 든든한 빵이에요. 햄과 모짜렐라, 토마토, 루꼴라에 바질 페스토를 바른 치아바타 샌드위치예요." },
  { category: "푸드", name: "고리 부적 빵", base: "베이글", ingredient: "베이글", price: 4500, emotions: ["긴장됨"], tastes: ["고소한"], effects: ["든든함", "고소함"], color: "#CFA470", description: "행운을 지켜 주는 고리 모양 부적 빵이에요. 쫄깃한 플레인 베이글이에요." },
  { category: "푸드", name: "모닥불 토스트", base: "토스트", ingredient: "토스트", price: 4500, emotions: ["그리움", "울적함"], tastes: ["고소한", "따뜻한", "달콤한"], effects: ["고소함", "든든함"], color: "#E0B072", description: "모닥불 앞에서 노릇하게 구운 모험가의 아침이에요. 버터를 발라 구운 두툼한 식빵 토스트예요." },
];

export const basicMenuCategories = [...new Set(basicMenus.map((menu) => menu.category))];

export const categoryIcons: Record<string, string> = { 커피: "☕", 논커피: "🍫", 과일라떼: "🍓", 티: "🍵", 스무디: "🧋", 프라페: "🧊", 디저트: "🧁", 푸드: "🥯" };

// 메뉴 번호(1~30)는 위 목록 순서. 메뉴 책장·기본 메뉴·상세 페이지가 같은 번호와 그림을 쓴다.
export const basicMenuId = (menu: BasicMenu) => basicMenus.findIndex(item => item.base === menu.base) + 1;
export const basicMenuImage = (id: number) => `/images/menus/basic/${String(id).padStart(2, "0")}.svg`;
export const getBasicMenu = (id: number): BasicMenu | undefined => basicMenus[id - 1];
// 효과 문구 — 첫 효과 태그는 +2, 나머지는 +1 (예: 활력 +2 · 상큼함 +1)
export const basicMenuEffects = (menu: BasicMenu) => menu.effects.map((effect, index) => `${effect} +${index === 0 ? 2 : 1}`);
