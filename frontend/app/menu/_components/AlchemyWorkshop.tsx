"use client";

import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";
import styles from "./AlchemyWorkshop.module.css";
import UserHeader from "../../_components/UserHeader";
import MokaMessage from "../../_components/MokaMessage";
import { basicMenus, getBasicMenu } from "./alchemyMenus";

// 기반 재료는 기본 메뉴 30종에서 가져온다 — 기반 재료만 고른 가격이 곧 그 기본 메뉴 가격이다 (README "공통 재료 선반").
const baseIcons: Record<string, string> = { "다크 로스트": "🌑", "라이트 로스트": "🌅", "디카페인": "💤", "초코": "🍫", "말차": "🍵", "고구마": "🍠", "곡물": "🌾", "딸기청": "🍓", "블루베리청": "🫐", "망고청": "🥭", "얼그레이": "🫖", "캐모마일": "🌼", "히비스커스": "🌺", "녹차": "🍃", "딸기": "🍓", "망고": "🥭", "바나나": "🍌", "블루베리": "🫐", "모카": "☕", "쿠키앤크림": "🍪", "카라멜": "🍮", "조각 케이크": "🍰", "와플": "🧇", "크로플": "🥐", "마카롱": "🍪", "크루아상": "🥐", "치아바타": "🥖", "베이글": "🥯", "토스트": "🍞" };
const basesOf = (category: string) => basicMenus.filter((menu) => menu.category === category).map((menu) => [menu.ingredient, baseIcons[menu.ingredient] ?? "🧪", menu.price] as const);

const shelves = {
  coffee: { label: "커피", spell: "어둠의 물약", icon: "☕", category: "커피", bases: basesOf("커피"), extras: [["바닐라", "✨", 500], ["캐러멜", "🟤", 500], ["오트", "🥛", 700], ["휘핑", "☁️", 600]] },
  tea: { label: "티", spell: "약초 달임", icon: "🍵", category: "티", bases: basesOf("티"), extras: [["꿀", "🍯", 500], ["레몬청", "🍋", 600], ["허브", "🌿", 500]] },
  fruit: { label: "과일 라떼", spell: "열매의 물약", icon: "🍓", category: "과일라떼", bases: basesOf("과일라떼"), extras: [["우유", "🥛", 500], ["과육", "🍒", 700], ["크림", "☁️", 600]] },
  smoothie: { label: "스무디", spell: "정령의 진액", icon: "🧋", category: "스무디", bases: basesOf("스무디"), extras: [["요거트", "🍶", 600], ["우유", "🥛", 500], ["꿀", "🍯", 500]] },
  noncoffee: { label: "논커피", spell: "대지의 물약", icon: "🍫", category: "논커피", bases: basesOf("논커피"), extras: [["우유", "🥛", 500], ["꿀", "🍯", 500], ["휘핑", "☁️", 600]] },
  frappe: { label: "프라페", spell: "얼음 결정 엘릭서", icon: "🧊", category: "프라페", bases: basesOf("프라페"), extras: [["시럽", "✨", 500], ["휘핑", "☁️", 600], ["초코칩", "🍫", 500]] },
  dessert: { label: "디저트", spell: "연성 과자", icon: "🧁", category: "디저트", bases: basesOf("디저트"), extras: [["아이스크림", "🍨", 800], ["베리 소스", "🍓", 600], ["생크림", "☁️", 600]] },
  food: { label: "푸드", spell: "모험가의 식량", icon: "🥯", category: "푸드", bases: basesOf("푸드"), extras: [["크림치즈", "🧀", 700], ["연어", "🐟", 1200], ["에그", "🍳", 800]] },
} as const;

type ShelfKey = keyof typeof shelves;

const signaturePotionNames: Record<string, string> = {
  "다크 로스트|바닐라": "빛과 어둠의 균형 포션",
  "캐모마일|꿀": "잠드는 꼬리 포션",
  "딸기청|우유|크림": "분홍 고양이 포션",
  "망고|요거트": "태양 정령의 진액",
  "쿠키앤크림|초코칩|휘핑": "눈보라 엘릭서",
  "베이글|연어|크림치즈": "바다 사냥꾼 식량",
};

const tourSteps = [
  { title: "계열을 먼저 골라요", text: "커피부터 푸드까지 원하는 계열을 선택하면 그에 맞는 재료 선반이 열려요." },
  { title: "기반 재료는 필수예요", text: "왼쪽 선반에서 기반 재료 하나를 고르고, 추가 재료는 최대 세 가지까지 더해 보세요." },
  { title: "솥에 재료를 확인해요", text: "선택한 재료가 중앙 연금솥 아래에 모여요. 준비되면 조합하기를 눌러요." },
  { title: "완성된 포션을 담아요", text: "오른쪽에서 포션의 등급과 가격을 확인한 뒤 장바구니에 담을 수 있어요." },
];

// 메뉴 상세에서 "조합하기"로 넘어오면(?menu=번호) 그 메뉴의 계열과 기반 재료를 골라 둔 채로 연다.
function startingPoint(menuId?: number): { category: ShelfKey; baseIndex: number } {
  const menu = menuId ? getBasicMenu(menuId) : undefined;
  const key = menu && (Object.keys(shelves) as ShelfKey[]).find((shelfKey) => shelves[shelfKey].category === menu.category);
  if (!menu || !key) return { category: "coffee", baseIndex: 0 };
  return { category: key, baseIndex: Math.max(0, shelves[key].bases.findIndex((base) => base[0] === menu.ingredient)) };
}

export default function AlchemyWorkshop({ initialMenuId }: { initialMenuId?: number }) {
  const [start] = useState(() => startingPoint(initialMenuId));
  const [category, setCategory] = useState<ShelfKey>(start.category);
  const [baseIndex, setBaseIndex] = useState(start.baseIndex);
  const [extras, setExtras] = useState<number[]>([]);
  const [tourOpen, setTourOpen] = useState(true);
  const [tourStep, setTourStep] = useState(0);
  const shelf = shelves[category];
  const base = shelf.bases[baseIndex];
  const price = useMemo(() => base[2] + extras.reduce((total, index) => total + shelf.extras[index][2], 0), [base, extras, shelf]);
  const selectedExtraNames = extras.map((index) => shelf.extras[index][0]);
  const potionName = useMemo(() => {
    const recipeKey = [base[0], ...selectedExtraNames].join("|");
    if (signaturePotionNames[recipeKey]) return signaturePotionNames[recipeKey];
    if (selectedExtraNames.length === 0) return `${base[0]}의 ${shelf.spell}`;
    return `${selectedExtraNames[0]} ${shelf.spell}`;
  }, [base, selectedExtraNames, shelf.spell]);
  const selectCategory = (key: ShelfKey) => { setCategory(key); setBaseIndex(0); setExtras([]); };
  const putInCart = () => addToCart({ name: potionName, options: [base[0], ...selectedExtraNames], unitPrice: price });
  const toggleExtra = (index: number) => setExtras((selected) => selected.includes(index) ? selected.filter((value) => value !== index) : selected.length < 3 ? [...selected, index] : selected);

  return <><UserHeader /><main className={styles.page}>
    <header className={styles.hero}><span>MOKA&apos;S ALCHEMY WORKSHOP</span><h1>오늘의 포션을<br /><em>연성해 볼까요?</em></h1><p>기반 재료를 하나 고르고 마음에 드는 촉매를 더해 보세요. 모카 점장이 당신만의 주문을 완성해 드릴게요냥.</p><button type="button" className={styles.tourStart} onClick={() => { setTourStep(0); setTourOpen(true); }}>✦ 조합 방법 보기</button><b aria-hidden="true">🐈‍⬛</b></header>
    <section className={styles.workshop} aria-label="포션 조합 공방">
      <div className={styles.steps}><b>01 계열 선택</b><i /> <b>02 재료 고르기</b><i /> <span>03 포션 완성</span></div>
      <nav className={styles.categories}>{(Object.keys(shelves) as ShelfKey[]).map((key) => <button type="button" key={key} className={key === category ? styles.active : ""} onClick={() => selectCategory(key)}><strong>{shelves[key].icon}</strong>{shelves[key].label}<small>{shelves[key].spell}</small></button>)}</nav>
      <div className={styles.builder}>
        <section className={styles.shelves}>
          <h2><i>①</i> 기반 재료 선반 <small>필수로 하나 골라 주세요</small></h2>
          <div className={styles.cards}>{shelf.bases.map((item, index) => <button type="button" key={item[0]} className={index === baseIndex ? styles.selected : ""} onClick={() => setBaseIndex(index)}><i>{item[1]}</i><b>{item[0]}</b><small>+{item[2].toLocaleString()}원</small></button>)}</div>
          <h2><i>②</i> 추가 재료 선반 <small>최대 세 가지까지 선택 가능해요</small></h2>
          <div className={styles.cards}>{shelf.extras.map((item, index) => <button type="button" key={item[0]} className={extras.includes(index) ? styles.selected : ""} onClick={() => toggleExtra(index)}><i>{item[1]}</i><b>{item[0]}</b><small>+{item[2].toLocaleString()}원</small></button>)}</div>
        </section>
        <section className={styles.alchemy}>
          <h2>연금술</h2>
          <div className={styles.speech}><b>🐱 모카 사장님</b><p>“{base[0]}의 정수에 한 방울이라... 마무리 가루도 넣어 볼까요?”</p></div>
          <div className={styles.pot} aria-label="연금술 솥"><img src="/images/alchemy-cauldron.png" alt="갈색 물약이 끓고 있는 연금술 솥" /></div>
          <h3>솥에 들어간 재료</h3><div className={styles.ingredients}><span>{base[0]} ×</span>{extras.map((index) => <span key={index}>{shelf.extras[index][0]} ×</span>)}</div>
          <button type="button" className={styles.brew}>◌ 조합하기</button>
        </section>
        <aside className={styles.cauldron}><h2>완성된 포션</h2><div className={styles.result}><span>⚗️</span><em>희귀 등급</em><h3>{potionName}</h3><p>{base[0]} · {selectedExtraNames.join(" · ") || "기본 레시피"}</p><div className={styles.tags}><b>활력 +2</b><b>달콤함 +1</b><b>부드러움 +1</b></div></div><div className={styles.price}><small>예상 가격</small><b>{price.toLocaleString()}원</b></div><button type="button" onClick={putInCart}>장바구니에 담기</button><div className={styles.secondary}><button type="button">도감에 기록</button><button type="button">레시피 공유</button></div></aside>
      </div>
    </section>
    <p className={styles.notice}>기반 재료는 필수이며, 추가 재료는 최대 세 가지까지 선택할 수 있어요. 실제 주문 전 알레르기 정보를 확인해 주세요.</p>
    {tourOpen && <MokaMessage label={`MOKA'S ALCHEMY GUIDE · ${tourStep + 1}/${tourSteps.length}`} message={`${tourSteps[tourStep].title} — ${tourSteps[tourStep].text}`}><button type="button" onClick={() => setTourOpen(false)}>건너뛰기</button>{tourStep > 0 && <button type="button" onClick={() => setTourStep((step) => step - 1)}>이전</button>}<button type="button" onClick={() => tourStep === tourSteps.length - 1 ? setTourOpen(false) : setTourStep((step) => step + 1)}>{tourStep === tourSteps.length - 1 ? "완료" : "다음"} →</button></MokaMessage>}
  </main></>;
}
