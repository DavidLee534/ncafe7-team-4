"use client";

import Link from "next/link";
import { type CSSProperties, type MouseEvent, type PointerEvent, useRef, useState } from "react";
import { addToCart } from "@/lib/cart";
import AlchemyModeLayout from "./AlchemyModeLayout";
import { basicMenuId, type BasicMenu } from "./alchemyMenus";
import styles from "./EmotionAlchemyWorkshop.module.css";
import own from "./AlchemyWorkshop.module.css";

// 기반 재료의 판매 여부와 가격은 DB 메뉴에서 전달받는다.
const basesOf = (category: string, menus: BasicMenu[]) => menus.filter((menu) => menu.category === category).map((menu) => [menu.ingredient, "", menu.price] as const);

const shelves = {
  coffee: { label: "커피", spell: "어둠의 물약", icon: "☕", category: "커피", extras: [["바닐라", "✨", 500], ["캐러멜", "🟤", 500], ["오트", "🥛", 700], ["휘핑", "☁️", 600]] },
  tea: { label: "티", spell: "약초 달임", icon: "🍵", category: "티", extras: [["꿀", "🍯", 500], ["레몬청", "🍋", 600], ["허브", "🌿", 500]] },
  fruit: { label: "과일 라떼", spell: "열매의 물약", icon: "🍓", category: "과일라떼", extras: [["우유", "🥛", 500], ["과육", "🍒", 700], ["크림", "☁️", 600]] },
  smoothie: { label: "스무디", spell: "정령의 진액", icon: "🧋", category: "스무디", extras: [["요거트", "🍶", 600], ["우유", "🥛", 500], ["꿀", "🍯", 500]] },
  noncoffee: { label: "논커피", spell: "대지의 물약", icon: "🍫", category: "논커피", extras: [["우유", "🥛", 500], ["꿀", "🍯", 500], ["휘핑", "☁️", 600]] },
  frappe: { label: "프라페", spell: "얼음 결정 엘릭서", icon: "🧊", category: "프라페", extras: [["시럽", "✨", 500], ["휘핑", "☁️", 600], ["초코칩", "🍫", 500]] },
  dessert: { label: "디저트", spell: "연성 과자", icon: "🧁", category: "디저트", extras: [["아이스크림", "🍨", 800], ["베리 소스", "🍓", 600], ["생크림", "☁️", 600]] },
  food: { label: "푸드", spell: "모험가의 식량", icon: "🥯", category: "푸드", extras: [["크림치즈", "🧀", 700], ["연어", "🐟", 1200], ["에그", "🍳", 800]] },
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

const MAX_EXTRAS = 3;

type Potion = { name: string; grade: "일반" | "희귀" | "전설"; icon: string; ingredients: { name: string; price: number }[]; price: number };
type FlyingIngredient = { id: number; label: string; x: number; y: number; dx: number; dy: number };

// 고른 재료로 완성될 포션 — 정해 둔 비밀 레시피와 같으면 전설, 추가 재료가 둘 이상이면 희귀.
function brew(category: ShelfKey, baseIndex: number, extras: number[], menus: BasicMenu[]): Potion {
  const shelf = shelves[category];
  const base = basesOf(shelf.category, menus)[baseIndex];
  const extraItems = extras.map((index) => shelf.extras[index]);
  const extraNames = extraItems.map((item) => item[0]);
  const signature = signaturePotionNames[[base[0], ...extraNames].join("|")];
  const ingredients = [{ name: base[0] as string, price: base[2] as number }, ...extraItems.map((item) => ({ name: item[0] as string, price: item[2] as number }))];
  return {
    name: signature ?? (extraNames.length === 0 ? `${base[0]}의 ${shelf.spell}` : `${extraNames[0]} ${shelf.spell}`),
    grade: signature ? "전설" : extraNames.length >= 2 ? "희귀" : "일반",
    icon: shelf.icon,
    ingredients,
    price: ingredients.reduce((total, item) => total + item.price, 0),
  };
}

// 메뉴 상세에서 "조합하기"로 넘어오면 그 메뉴의 계열과 기반 재료를 미리 골라 둔다.
function startingPoint(menuId: number | undefined, menus: BasicMenu[]): { category: ShelfKey | null; baseIndex: number | null } {
  const menu = menuId ? menus.find(item => basicMenuId(item) === menuId) : undefined;
  const key = menu && (Object.keys(shelves) as ShelfKey[]).find((shelfKey) => shelves[shelfKey].category === menu.category);
  if (!menu || !key) return { category: null, baseIndex: null };
  const baseIndex = basesOf(shelves[key].category, menus).findIndex((base) => base[0] === menu.ingredient);
  return { category: key, baseIndex: baseIndex >= 0 ? baseIndex : null };
}

export default function AlchemyWorkshop({ initialMenuId, menus }: { initialMenuId?: number; menus: BasicMenu[] }) {
  // 처음에는 아무것도 고르지 않은 상태(상세에서 넘어오면 그 메뉴 기준). 계열과 기반 재료는 필수다.
  const [start] = useState(() => startingPoint(initialMenuId, menus));
  const [category, setCategory] = useState<ShelfKey | null>(start.category);
  const [baseIndex, setBaseIndex] = useState<number | null>(start.baseIndex);
  const [extras, setExtras] = useState<number[]>([]);
  const [potion, setPotion] = useState<Potion | null>(null); // 조합하기 전에는 비어 있다
  const [addedName, setAddedName] = useState<string | null>(null);
  const [isBrewing, setIsBrewing] = useState(false);
  const [clickPulse, setClickPulse] = useState<{ x: number; y: number } | null>(null);
  const [flyingIngredients, setFlyingIngredients] = useState<FlyingIngredient[]>([]);
  const potSceneRef = useRef<HTMLDivElement>(null);
  const flightIdRef = useRef(0);
  const [missing, setMissing] = useState<"category" | "base" | null>(null); // 필수 선택 없이 조합하기를 누르면 안내
  const shelf = category ? shelves[category] : null;
  const availableBases = shelf ? basesOf(shelf.category, menus) : [];
  const preview = category && baseIndex !== null ? brew(category, baseIndex, extras, menus) : null;
  const recipeOf = (item: Potion) => item.ingredients.map((ingredient) => ingredient.name).join("|");
  const changed = potion !== null && (preview === null || recipeOf(preview) !== recipeOf(potion));
  const selectCategory = (key: ShelfKey) => { if (isBrewing) return; setCategory(key); setBaseIndex(null); setExtras([]); setMissing(null); };
  const flyToCauldron = (event: MouseEvent<HTMLButtonElement>, label: string) => {
    const origin = event.currentTarget.getBoundingClientRect();
    const cauldron = potSceneRef.current?.getBoundingClientRect();
    if (!cauldron || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = ++flightIdRef.current;
    const x = origin.left + origin.width / 2;
    const y = origin.top + origin.height / 2;
    setFlyingIngredients((current) => [...current, { id, label, x, y, dx: cauldron.left + cauldron.width / 2 - x, dy: cauldron.top + cauldron.height * .48 - y }]);
    window.setTimeout(() => setFlyingIngredients((current) => current.filter((item) => item.id !== id)), 720);
  };
  const selectBase = (event: MouseEvent<HTMLButtonElement>, index: number, label: string) => { if (isBrewing) return; flyToCauldron(event, label); setBaseIndex(index); setMissing(null); };
  const combine = () => {
    if (!category) return setMissing("category");
    if (!preview) return setMissing("base");
    setIsBrewing(true);
    window.setTimeout(() => {
      setPotion(preview);
      setIsBrewing(false);
    }, 1450);
  };
  const toggleExtra = (event: MouseEvent<HTMLButtonElement>, index: number, label: string) => { if (isBrewing) return; if (!extras.includes(index) && extras.length < MAX_EXTRAS) flyToCauldron(event, label); setExtras((selected) => selected.includes(index) ? selected.filter((value) => value !== index) : selected.length < MAX_EXTRAS ? [...selected, index] : selected); };
  const putInCart = async (potion: Potion) => { setAddedName(null); try { await addToCart({ name: potion.name, options: potion.ingredients.map((item) => item.name), unitPrice: potion.price }); setAddedName(potion.name); } catch (error) { window.alert(error instanceof Error ? error.message : "담지 못했어요."); } };
  const showClickFeedback = (event: PointerEvent<HTMLElement>) => {
    if (!(event.target instanceof Element) || !event.target.closest("button, a")) return;
    setClickPulse({ x: event.clientX, y: event.clientY });
    window.setTimeout(() => setClickPulse(null), 520);
  };

  return <AlchemyModeLayout mode="material" eyebrow="MOKA'S MATERIAL ALCHEMY" title="재료 연금술" description={<>계열을 고르고 <b>기반 재료</b> 하나에 마음에 드는 <b>추가 재료</b>를 더해 연금솥에 넣으면, 모카 사장님이 세상에 하나뿐인 포션을 완성해 줘요.</>}>
    <section className={styles.workshop} aria-label="재료 연금술 공방" onPointerDown={showClickFeedback}>
      {clickPulse && <span className={own.clickPulse} style={{ left: clickPulse.x, top: clickPulse.y }} aria-hidden="true">✦</span>}
      {flyingIngredients.map((item) => <span key={item.id} className={own.flyingIngredient} style={{ left: item.x, top: item.y, "--flight-x": `${item.dx}px`, "--flight-y": `${item.dy}px` } as CSSProperties} aria-hidden="true">{item.label}</span>)}
      <section className={styles.shelf}>
        <h2>재료 선반</h2><p>기반 재료는 꼭 1개, 추가 재료는 {MAX_EXTRAS}개까지 고를 수 있어요.</p>
        <div className={`${styles.sectionTitle} ${missing === "category" ? own.missing : ""}`}><b>계열</b><small>{shelf ? shelf.spell : "필수 1개 · 0/1"}</small></div>
        <div className={`${styles.choiceGrid} ${own.categoryGrid}`}>{(Object.keys(shelves) as ShelfKey[]).map((key) => <button type="button" key={key} className={key === category ? styles.selectedEmotion : ""} onClick={() => selectCategory(key)}>{shelves[key].label}</button>)}</div>
        <div className={`${styles.sectionTitle} ${missing === "base" ? own.missing : ""}`}><b>기반 재료</b><small>필수 1개 · {baseIndex === null ? 0 : 1}/1</small></div>
        {shelf ? <div className={`${styles.choiceGrid} ${own.categoryGrid}`}>{availableBases.map((item, index) => <button type="button" key={item[0]} className={index === baseIndex ? styles.selectedEmotion : ""} onClick={(event) => selectBase(event, index, item[0])}>{item[0]}</button>)}</div> : <p className={own.placeholder}>계열을 먼저 골라 주세요.</p>}
        <div className={styles.sectionTitle}><b>추가 재료</b><small>선택 0~{MAX_EXTRAS} · {extras.length}/{MAX_EXTRAS}</small></div>
        {shelf ? <div className={styles.choiceGrid}>{shelf.extras.map((item, index) => <button type="button" key={item[0]} className={`${own.ingredient} ${extras.includes(index) ? styles.selectedTaste : ""}`} onClick={(event) => toggleExtra(event, index, item[0])}>{item[0]}<small>+{item[2].toLocaleString()}원</small></button>)}</div> : <p className={own.placeholder}>계열을 먼저 골라 주세요.</p>}
      </section>
      <section className={`${styles.potPanel} ${isBrewing ? own.brewing : ""}`} aria-busy={isBrewing}>
        <h2>연금솥</h2><p>넣은 재료</p>
        <div className={styles.tags}>{(preview?.ingredients ?? []).map((item, index) => <span key={item.name}>{index === 0 ? "기반" : "추가"} · {item.name}</span>)}{!preview && <span>아직 넣은 재료가 없어요</span>}</div>
        <div className={own.brewScene} ref={potSceneRef}>
          <span className={own.sparkOne} aria-hidden="true">✦</span><span className={own.sparkTwo} aria-hidden="true">✧</span><span className={own.sparkThree} aria-hidden="true">✦</span>
          <img src={isBrewing || potion ? "/images/alchemy-cauldron-brewing.png" : "/images/alchemy-cauldron-empty.png"} alt={isBrewing || potion ? "끓고 있는 연금술 솥" : "비어 있는 연금술 솥"} />
        </div>
        <p className={own.estimate}>예상 가격 <b>{preview ? `${preview.price.toLocaleString()}원` : "—"}</b></p>
        {missing && <p className={own.warning} role="alert">{missing === "category" ? "계열을 먼저 골라 주세요!" : "기반 재료를 하나 골라 주세요!"}</p>}
        <div className={styles.potActions}><button type="button" onClick={combine} disabled={isBrewing}>{isBrewing ? "연성 중..." : "조합하기"}</button><button type="button" disabled={isBrewing} onClick={() => { setBaseIndex(null); setExtras([]); setPotion(null); setMissing(null); }}>비우기</button></div>
      </section>
      <aside className={styles.result}>
        <h2>완성된 포션</h2><p>조합하기를 누르면 솥 속 재료로 포션이 완성돼요.</p>
        {potion ? <>
        <div className={styles.speech}><b>모카 사장님</b><span>{changed ? "솥에 새 재료가 들어갔다냥. 조합하기를 누르면 바로 끓여 줄게냥." : `${potion.ingredients[0].name}의 정수가 잘 우러났다냥. 이대로 담아 갈 거냥?`}</span></div>
        <article className={styles.recommend}>
          <span>{potion.grade} 등급 포션</span><h3>{potion.name}</h3><p>{potion.ingredients.map((item) => item.name).join(" · ")} · {potion.price.toLocaleString()}원</p>
          <div>{potion.ingredients.map((item) => <b key={item.name}>✓ {item.name}</b>)}</div>
          <button type="button" className={styles.addCart} onClick={() => putInCart(potion)}>🛒 장바구니에 담기</button>{addedName === potion.name && <p className={styles.added} role="status">담았어요! <Link href="/cart">장바구니 보기 →</Link></p>}
        </article>
        <div className={styles.otherList}>{potion.ingredients.map((item, index) => <article key={item.name}><span>{index === 0 ? "기반 재료" : "추가 재료"}</span><b>{item.name}</b><small>{index === 0 ? "" : "+"}{item.price.toLocaleString()}원</small></article>)}</div>
        </> : <div className={styles.emptyResult}><p>아직 완성된 포션이 없어요.<br />재료를 넣고 조합하기를 눌러 주세요.</p></div>}
      </aside>
    </section>
    <section className={styles.how}><h2>이렇게 동작해요</h2><div><article><b>1단계 · 계열</b><h3>만들고 싶은 계열 선택</h3><p>커피부터 푸드까지 8가지 계열 중 하나를 고르면 그 계열의 재료 선반이 열려요.</p></article><article><b>2단계 · 재료</b><h3>기반 1개 + 추가 0~{MAX_EXTRAS}개</h3><p>기반 재료는 꼭 하나, 추가 재료는 원하는 만큼(최대 {MAX_EXTRAS}개) 골라 솥에 넣어요.</p></article><article><b>3단계 · 완성</b><h3>포션 이름·등급·가격 확인</h3><p>비밀 레시피와 같으면 전설 등급! 기반 가격에 추가 재료 가격을 더해 바로 장바구니에 담을 수 있어요.</p></article></div></section>
    <p className={own.notice}>실제 주문 전 알레르기 정보를 확인해 주세요.</p>
  </AlchemyModeLayout>;
}
