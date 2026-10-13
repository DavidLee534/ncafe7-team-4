"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import UserHeader from "../../_components/UserHeader";
import styles from "./EmotionAlchemyWorkshop.module.css";

type Emotion = "피곤함" | "열정" | "그리움" | "울적함" | "설렘" | "긴장됨";
type Taste = "달콤한" | "쌉싸름한" | "상큼한" | "고소한" | "시원한" | "따뜻한";

const emotions: { name: Emotion; color: string }[] = [
  { name: "피곤함", color: "#91a8ff" }, { name: "열정", color: "#ff7359" }, { name: "그리움", color: "#d9a75c" },
  { name: "울적함", color: "#6f9fe8" }, { name: "설렘", color: "#ec7cab" }, { name: "긴장됨", color: "#76cf9b" },
];
const tastes: Taste[] = ["달콤한", "쌉싸름한", "상큼한", "고소한", "시원한", "따뜻한"];

type Menu = { category: string; name: string; base: string; price: number; emotions: Emotion[]; tastes: Taste[] };
const menus: Menu[] = [
  { category: "커피", name: "칠흑 고양이의 물약", base: "다크 로스트 커피", price: 4000, emotions: ["피곤함"], tastes: ["쌉싸름한", "따뜻한"] },
  { category: "커피", name: "새벽 수염의 물약", base: "라이트 로스트 커피", price: 4000, emotions: ["피곤함", "설렘"], tastes: ["상큼한", "쌉싸름한"] },
  { category: "커피", name: "잠든 고양이의 물약", base: "디카페인 커피", price: 4300, emotions: ["긴장됨"], tastes: ["쌉싸름한", "따뜻한"] },
  { category: "논커피", name: "검은 숲의 물약", base: "초코 라떼", price: 5000, emotions: ["울적함"], tastes: ["달콤한", "따뜻한"] },
  { category: "논커피", name: "숲의 숨결", base: "말차 라떼", price: 5000, emotions: ["긴장됨"], tastes: ["쌉싸름한", "고소한"] },
  { category: "논커피", name: "노을 뿌리 물약", base: "고구마 라떼", price: 5000, emotions: ["그리움"], tastes: ["고소한", "달콤한", "따뜻한"] },
  { category: "논커피", name: "들판의 축복", base: "곡물 라떼", price: 5000, emotions: ["그리움"], tastes: ["고소한", "따뜻한"] },
  { category: "과일라떼", name: "분홍 고양이 포션", base: "딸기 라떼", price: 5500, emotions: ["설렘"], tastes: ["달콤한", "시원한"] },
  { category: "과일라떼", name: "달빛 열매 포션", base: "블루베리 라떼", price: 5500, emotions: ["설렘", "울적함"], tastes: ["상큼한", "달콤한"] },
  { category: "과일라떼", name: "황금 열매 포션", base: "망고 라떼", price: 5500, emotions: ["열정"], tastes: ["달콤한", "시원한"] },
  { category: "티", name: "귀족 고양이의 달임", base: "얼그레이 티", price: 4500, emotions: ["그리움"], tastes: ["쌉싸름한", "따뜻한"] },
  { category: "티", name: "잠드는 꼬리", base: "캐모마일 티", price: 4500, emotions: ["긴장됨", "피곤함"], tastes: ["따뜻한"] },
  { category: "티", name: "붉은 마녀의 달임", base: "히비스커스 티", price: 4500, emotions: ["열정"], tastes: ["상큼한", "따뜻한"] },
  { category: "티", name: "초록 수풀 달임", base: "녹차", price: 4500, emotions: ["긴장됨"], tastes: ["쌉싸름한", "따뜻한"] },
  { category: "스무디", name: "장미 정령의 진액", base: "딸기 스무디", price: 5800, emotions: ["설렘"], tastes: ["상큼한", "시원한", "달콤한"] },
  { category: "스무디", name: "태양 정령의 진액", base: "망고 스무디", price: 5800, emotions: ["열정"], tastes: ["달콤한", "시원한"] },
  { category: "스무디", name: "햇살 꼬리 정령의 진액", base: "바나나 스무디", price: 5800, emotions: ["피곤함", "울적함"], tastes: ["달콤한", "고소한", "시원한"] },
  { category: "스무디", name: "밤하늘 정령의 진액", base: "블루베리 스무디", price: 5800, emotions: ["울적함"], tastes: ["상큼한", "시원한"] },
  { category: "프라페", name: "얼어붙은 밤 엘릭서", base: "모카 프라페", price: 6000, emotions: ["피곤함"], tastes: ["달콤한", "쌉싸름한", "시원한"] },
  { category: "프라페", name: "눈보라 엘릭서", base: "쿠키앤크림 프라페", price: 6000, emotions: ["설렘"], tastes: ["달콤한", "시원한"] },
  { category: "프라페", name: "서리숲 엘릭서", base: "녹차 프라페", price: 6000, emotions: ["열정"], tastes: ["쌉싸름한", "시원한"] },
  { category: "프라페", name: "호박빛 빙하 엘릭서", base: "카라멜 프라페", price: 6000, emotions: ["울적함"], tastes: ["달콤한", "시원한"] },
  { category: "디저트", name: "마법진 케이크", base: "조각 케이크", price: 6500, emotions: ["설렘"], tastes: ["달콤한"] },
  { category: "디저트", name: "격자 결계 와플", base: "와플", price: 5500, emotions: ["울적함"], tastes: ["달콤한", "따뜻한"] },
  { category: "디저트", name: "황금 비늘 과자", base: "크로플", price: 5500, emotions: ["그리움", "열정"], tastes: ["달콤한", "고소한"] },
  { category: "디저트", name: "요정의 동전", base: "마카롱", price: 4000, emotions: ["설렘"], tastes: ["달콤한", "상큼한"] },
  { category: "푸드", name: "초승달 빵", base: "크루아상", price: 5000, emotions: ["그리움"], tastes: ["고소한"] },
  { category: "푸드", name: "떠돌이 기사의 빵", base: "치아바타 샌드위치", price: 7000, emotions: ["피곤함", "열정"], tastes: ["고소한"] },
  { category: "푸드", name: "고리 부적 빵", base: "베이글", price: 4500, emotions: ["긴장됨"], tastes: ["고소한"] },
  { category: "푸드", name: "모닥불 토스트", base: "토스트", price: 4500, emotions: ["그리움", "울적함"], tastes: ["고소한", "따뜻한", "달콤한"] },
];

export default function EmotionAlchemyWorkshop() {
  const [emotion, setEmotion] = useState<Emotion>("피곤함");
  const [selectedTastes, setSelectedTastes] = useState<Taste[]>(["고소한", "시원한"]);
  const [recommended, setRecommended] = useState(menus[16]);
  const ranked = useMemo(() => [...menus].map((menu, index) => ({ menu, index, score: (menu.emotions.includes(emotion) ? 3 : 0) + selectedTastes.filter((taste) => menu.tastes.includes(taste)).length * 2 })).sort((a, b) => b.score - a.score || a.index - b.index), [emotion, selectedTastes]);
  const preview = ranked[0].menu;
  const toggleTaste = (taste: Taste) => setSelectedTastes((current) => current.includes(taste) ? current.filter((item) => item !== taste) : current.length < 2 ? [...current, taste] : current);
  const selectedTags = [`감정 · ${emotion}`, ...selectedTastes.map((taste) => `맛 · ${taste}`)];

  return <><UserHeader /><main className={styles.page}>
    <header className={styles.hero}><span>NEW &amp; BREW · 기획 시안</span><h1>감정 연금술</h1><p>오늘 뭘 먹고 싶은지 모르겠을 때, 지금 <b>기분</b>과 끌리는 <b>맛</b>을 연금솥에 넣으면 고양이 사장이 기분과 어울리는 메뉴를 골라줘요. 재료 연금술은 그대로 두고, 옆에서 가볍고 빠르게 즐기는 구조예요.</p></header>
    <nav className={styles.modeTabs} aria-label="연금술 방식"><Link href="/menu/alchemy/material">재료 연금술</Link><span className={styles.active}>감정 연금술 <b>NEW</b></span><Link href="/menu">기본 메뉴 30종</Link></nav>
    <section className={styles.workshop} aria-label="감정 연금술 공방">
      <section className={styles.shelf}><h2>감정 선반</h2><p>감정은 꼭 1개, 맛은 2개까지 고를 수 있어요.</p><div className={styles.sectionTitle}><b>오늘의 기분</b><small>필수 1개 · 1/1</small></div><div className={styles.choiceGrid}>{emotions.map((item) => <button type="button" key={item.name} className={emotion === item.name ? styles.selectedEmotion : ""} onClick={() => setEmotion(item.name)}><i style={{ background: item.color }} />{item.name}</button>)}</div><div className={styles.sectionTitle}><b>끌리는 맛</b><small>선택 0~2 · {selectedTastes.length}/2</small></div><div className={styles.choiceGrid}>{tastes.map((taste) => <button type="button" key={taste} className={selectedTastes.includes(taste) ? styles.selectedTaste : ""} onClick={() => toggleTaste(taste)}><i />{taste}</button>)}</div></section>
      <section className={styles.potPanel}><h2>연금솥</h2><p>넣은 재료</p><div className={styles.tags}>{selectedTags.map((tag) => <span key={tag}>{tag}</span>)}</div><img src="/images/alchemy-cauldron.png" alt="연금술 솥" /><div className={styles.potActions}><button type="button" onClick={() => setRecommended(preview)}>끓이기</button><button type="button" onClick={() => { setEmotion("피곤함"); setSelectedTastes([]); }}>비우기</button></div></section>
      <aside className={styles.result}><h2>사장님의 처방</h2><p>미리 정해 둔 메뉴 30종 중에서 골라요.</p><div className={styles.speech}><b>모카 사장님</b><span>오늘은 {emotion} 마음이군요. 지금 딱 어울리는 한 잔을 골라봤다냥.</span></div><article className={styles.recommend}><span>오늘의 처방 조합</span><h3>{recommended.name}</h3><p>{recommended.base} · {recommended.price.toLocaleString()}원</p><div>{recommended.emotions.map((item) => <b key={item}>✓ {item}</b>)}{recommended.tastes.map((item) => <b key={item}>✓ {item}</b>)}</div></article><div className={styles.otherList}>{ranked.slice(1, 4).map(({ menu }) => <article key={menu.name}><span>다른 후보</span><b>{menu.name}</b><small>{menu.base} · {menu.price.toLocaleString()}원</small></article>)}</div></aside>
    </section>
    <section className={styles.how}><h2>이렇게 동작해요</h2><div><article><b>1단계 · 손님</b><h3>감정 1개 + 맛 0~2개 선택</h3><p>메뉴를 몰라도 지금 상태만 고르면 돼요. 감정 키워드는 팀 투표로 정한 6개예요.</p></article><article><b>2단계 · 서버</b><h3>메뉴마다 붙인 태그와 비교</h3><p>감정이 맞으면 3점, 맛이 하나 맞을 때마다 2점. 가장 높은 메뉴 한 가지를 골라요.</p></article><article><b>3단계 · 결과</b><h3>정해진 메뉴를 바로 주문</h3><p>결과는 항상 기본 메뉴 30종 중 하나라서 가격·재고·주문 흐름을 그대로 써요.</p></article></div></section>
  </main></>;
}
