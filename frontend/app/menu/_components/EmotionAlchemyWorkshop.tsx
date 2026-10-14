"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";
import AlchemyModeLayout from "./AlchemyModeLayout";
import { basicMenus as menus, emotions, tastes, type BasicMenu, type Emotion, type Taste } from "./alchemyMenus";
import styles from "./EmotionAlchemyWorkshop.module.css";

export default function EmotionAlchemyWorkshop() {
  const [emotion, setEmotion] = useState<Emotion | null>(null); // 처음에는 아무것도 고르지 않은 상태. 기분은 필수
  const [selectedTastes, setSelectedTastes] = useState<Taste[]>([]);
  const [missing, setMissing] = useState(false); // 기분 없이 조합하기를 누르면 안내
  const [prescription, setPrescription] = useState<{ emotion: Emotion; menus: BasicMenu[] } | null>(null); // 조합하기 전에는 비어 있다. menus[0] 이 처방, 나머지는 다른 후보
  const [openIndex, setOpenIndex] = useState(0); // 펼쳐 둔 결과 하나
  const [addedName, setAddedName] = useState<string | null>(null);
  const ranked = useMemo(() => [...menus].map((menu, index) => ({ menu, index, score: (emotion && menu.emotions.includes(emotion) ? 3 : 0) + selectedTastes.filter((taste) => menu.tastes.includes(taste)).length * 2 })).sort((a, b) => b.score - a.score || a.index - b.index), [emotion, selectedTastes]);
  const toggleTaste = (taste: Taste) => setSelectedTastes((current) => current.includes(taste) ? current.filter((item) => item !== taste) : current.length < 2 ? [...current, taste] : current);
  const selectedTags = [...(emotion ? [`감정 · ${emotion}`] : []), ...selectedTastes.map((taste) => `맛 · ${taste}`)];

  return <AlchemyModeLayout mode="emotion" eyebrow="NEW & BREW · 기획 시안" title="감정 연금술" description={<>오늘 뭘 먹고 싶은지 모르겠을 때, 지금 <b>기분</b>과 끌리는 <b>맛</b>을 연금솥에 넣으면 고양이 사장이 기분과 어울리는 메뉴를 골라줘요.</>}>
    <section className={styles.workshop} aria-label="감정 연금술 공방">
      <section className={styles.shelf}><h2>감정 선반</h2><p>감정은 꼭 1개, 맛은 2개까지 고를 수 있어요.</p><div className={`${styles.sectionTitle} ${missing ? styles.missing : ""}`}><b>오늘의 기분</b><small>필수 1개 · {emotion ? 1 : 0}/1</small></div><div className={styles.choiceGrid}>{emotions.map((item) => <button type="button" key={item.name} className={emotion === item.name ? styles.selectedEmotion : ""} onClick={() => { setEmotion(item.name); setMissing(false); }}><i style={{ background: item.color }} />{item.name}</button>)}</div><div className={styles.sectionTitle}><b>끌리는 맛</b><small>선택 0~2 · {selectedTastes.length}/2</small></div><div className={styles.choiceGrid}>{tastes.map((taste) => <button type="button" key={taste} className={selectedTastes.includes(taste) ? styles.selectedTaste : ""} onClick={() => toggleTaste(taste)}><i />{taste}</button>)}</div></section>
      <section className={styles.potPanel}><h2>연금솥</h2><p>넣은 재료</p><div className={styles.tags}>{selectedTags.map((tag) => <span key={tag}>{tag}</span>)}{selectedTags.length === 0 && <span>아직 넣은 재료가 없어요</span>}</div><img src="/images/alchemy-cauldron.png" alt="연금술 솥" />{missing && <p className={styles.warning} role="alert">오늘의 기분을 하나 골라 주세요!</p>}<div className={styles.potActions}><button type="button" onClick={() => { if (!emotion) return setMissing(true); setPrescription({ emotion, menus: ranked.slice(0, 4).map(({ menu }) => menu) }); setOpenIndex(0); }}>조합하기</button><button type="button" onClick={() => { setEmotion(null); setSelectedTastes([]); setPrescription(null); setMissing(false); }}>비우기</button></div></section>
      <aside className={styles.result}><h2>사장님의 처방</h2><p>미리 정해 둔 메뉴 30종 중에서 골라요.</p>{prescription ? <><div className={styles.speech}><b>모카 사장님</b><span>오늘은 {prescription.emotion} 마음이군요. 지금 딱 어울리는 한 잔을 골라봤다냥.</span></div><div className={styles.candidates}>{prescription.menus.map((menu, index) => { const open = index === openIndex; return <article key={menu.name} className={`${styles.candidate} ${open ? styles.candidateOpen : ""}`}>
        <button type="button" className={styles.candidateHead} onClick={() => setOpenIndex(index)} aria-expanded={open}><span>{index === 0 ? "오늘의 처방 조합" : "다른 후보"}</span><b>{menu.name}</b><small>{menu.base} · {menu.price.toLocaleString()}원</small></button>
        {open && <div className={styles.candidateBody}><div className={styles.candidateTags}>{menu.emotions.map((item) => <b key={item}>✓ {item}</b>)}{menu.tastes.map((item) => <b key={item}>✓ {item}</b>)}</div><button type="button" className={styles.addCart} onClick={() => { addToCart({ name: menu.name, options: [menu.base], unitPrice: menu.price }); setAddedName(menu.name); }}>🛒 장바구니에 담기</button>{addedName === menu.name && <p className={styles.added} role="status">담았어요! <Link href="/cart">장바구니 보기 →</Link></p>}</div>}
      </article>; })}</div></> : <div className={styles.emptyResult}><p>아직 처방이 없어요.<br />기분과 맛을 넣고 조합하기를 눌러 주세요.</p></div>}</aside>
    </section>
    <section className={styles.how}><h2>이렇게 동작해요</h2><div><article><b>1단계 · 손님</b><h3>감정 1개 + 맛 0~2개 선택</h3><p>메뉴를 몰라도 지금 상태만 고르면 돼요. 감정 키워드는 팀 투표로 정한 6개예요.</p></article><article><b>2단계 · 서버</b><h3>메뉴마다 붙인 태그와 비교</h3><p>감정이 맞으면 3점, 맛이 하나 맞을 때마다 2점. 가장 높은 메뉴 한 가지를 골라요.</p></article><article><b>3단계 · 결과</b><h3>정해진 메뉴를 바로 주문</h3><p>결과는 항상 기본 메뉴 30종 중 하나라서 가격·재고·주문 흐름을 그대로 써요.</p></article></div></section>
  </AlchemyModeLayout>;
}
