"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";
import AlchemyModeLayout from "./AlchemyModeLayout";
import { basicMenus as menus, emotions, tastes, type BasicMenu, type Emotion, type Taste } from "./alchemyMenus";
import styles from "./EmotionAlchemyWorkshop.module.css";
import own from "./AlchemyWorkshop.module.css";

const emotionTracks = [
  { id: "restore", label: "회복의 연금술", emotions: ["피곤함", "긴장됨"] as Emotion[] },
  { id: "comfort", label: "위로의 연금술", emotions: ["울적함", "그리움"] as Emotion[] },
  { id: "spark", label: "설렘의 연금술", emotions: ["설렘", "열정"] as Emotion[] },
] as const;

type EmotionTrack = (typeof emotionTracks)[number];

export default function EmotionAlchemyWorkshop() {
  const [track, setTrack] = useState<EmotionTrack["id"] | null>(null);
  const [emotion, setEmotion] = useState<Emotion | null>(null); // 처음에는 아무것도 고르지 않은 상태. 기분은 필수
  const [selectedTastes, setSelectedTastes] = useState<Taste[]>([]);
  const [missing, setMissing] = useState(false); // 기분 없이 조합하기를 누르면 안내
  const [prescription, setPrescription] = useState<{ emotion: Emotion; menus: BasicMenu[] } | null>(null); // 조합하기 전에는 비어 있다. menus[0] 이 처방, 나머지는 다른 후보
  const [openIndex, setOpenIndex] = useState(0); // 펼쳐 둔 결과 하나
  const [addedName, setAddedName] = useState<string | null>(null);
  const [isBrewing, setIsBrewing] = useState(false);
  const activeTrack = emotionTracks.find((item) => item.id === track);
  const ranked = useMemo(() => [...menus].map((menu, index) => ({ menu, index, score: (emotion && menu.emotions.includes(emotion) ? 3 : 0) + selectedTastes.filter((taste) => menu.tastes.includes(taste)).length * 2 })).sort((a, b) => b.score - a.score || a.index - b.index), [emotion, selectedTastes]);
  const flyToCauldron = (label: string) => {
    const origin = document.activeElement instanceof HTMLElement ? document.activeElement.getBoundingClientRect() : null;
    const cauldron = document.querySelector(`.${styles.potPanel}`)?.getBoundingClientRect();
    if (!origin || !cauldron || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const particle = document.createElement("span");
    particle.className = own.flyingIngredient;
    particle.textContent = label;
    particle.style.left = `${origin.left + origin.width / 2}px`;
    particle.style.top = `${origin.top + origin.height / 2}px`;
    particle.style.setProperty("--flight-x", `${cauldron.left + cauldron.width / 2 - origin.left - origin.width / 2}px`);
    particle.style.setProperty("--flight-y", `${cauldron.top + cauldron.height * .48 - origin.top - origin.height / 2}px`);
    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 720);
  };
  const selectTrack = (nextTrack: EmotionTrack) => { setTrack(nextTrack.id); setEmotion(null); setSelectedTastes([]); setPrescription(null); setMissing(false); };
  const selectEmotion = (nextEmotion: Emotion) => { flyToCauldron(nextEmotion); setEmotion(nextEmotion); setPrescription(null); setMissing(false); };
  const toggleTaste = (taste: Taste) => { if (!selectedTastes.includes(taste) && selectedTastes.length < 2) flyToCauldron(taste); setSelectedTastes((current) => current.includes(taste) ? current.filter((item) => item !== taste) : current.length < 2 ? [...current, taste] : current); setPrescription(null); };
  const selectedTags = [...(emotion ? [`감정 · ${emotion}`] : []), ...selectedTastes.map((taste) => `맛 · ${taste}`)];
  const combine = () => {
    if (!track || !emotion) return setMissing(true);
    setIsBrewing(true);
    window.setTimeout(() => {
      setPrescription({ emotion, menus: ranked.slice(0, 4).map(({ menu }) => menu) });
      setOpenIndex(0);
      setIsBrewing(false);
    }, 1450);
  };
  const cauldronImage = isBrewing || prescription ? "/images/alchemy-cauldron-brewing.png" : "/images/alchemy-cauldron-empty.png";

  return <AlchemyModeLayout mode="emotion" eyebrow="MOKA'S EMOTION ALCHEMY" title="감정 연금술" description={<>오늘 뭘 먹고 싶은지 모르겠을 때, 지금 <b>기분</b>과 끌리는 <b>맛</b>을 연금솥에 넣으면 고양이 사장이 기분과 어울리는 메뉴를 골라줘요.</>}>
    <section className={styles.workshop} aria-label="감정 연금술 공방">
      <section className={styles.shelf}><h2>감정 선반</h2><p>재료 연금술처럼 계열부터 고른 뒤, 기반 감정과 맛을 솥에 넣어 조합해요.</p><div className={`${styles.sectionTitle} ${missing && !track ? styles.missing : ""}`}><b>① 감정 계열</b><small>필수 1개 · {track ? 1 : 0}/1</small></div><div className={`${styles.choiceGrid} ${own.categoryGrid}`}>{emotionTracks.map((item) => <button type="button" key={item.id} className={track === item.id ? styles.selectedEmotion : ""} onClick={() => selectTrack(item)}>{item.label}</button>)}</div><div className={`${styles.sectionTitle} ${missing && track && !emotion ? styles.missing : ""}`}><b>② 기반 감정</b><small>필수 1개 · {emotion ? 1 : 0}/1</small></div>{activeTrack ? <div className={`${styles.choiceGrid} ${own.categoryGrid}`}>{emotions.filter((item) => (activeTrack.emotions as readonly Emotion[]).includes(item.name)).map((item) => <button type="button" key={item.name} className={emotion === item.name ? styles.selectedEmotion : ""} onClick={() => selectEmotion(item.name)}><i style={{ background: item.color }} />{item.name}</button>)}</div> : <p className={own.placeholder}>감정 계열을 먼저 골라 주세요.</p>}<div className={styles.sectionTitle}><b>③ 끌리는 맛</b><small>선택 0~2 · {selectedTastes.length}/2</small></div>{activeTrack ? <div className={`${styles.choiceGrid} ${own.categoryGrid}`}>{tastes.map((taste) => <button type="button" key={taste} className={`${own.ingredient} ${selectedTastes.includes(taste) ? styles.selectedTaste : ""}`} onClick={() => toggleTaste(taste)}><i />{taste}</button>)}</div> : <p className={own.placeholder}>감정 계열을 먼저 골라 주세요.</p>}</section>
      <section className={`${styles.potPanel} ${isBrewing ? own.brewing : ""}`} aria-busy={isBrewing}><h2>연금솥</h2><p>넣은 재료</p><div className={styles.tags}>{selectedTags.map((tag) => <span key={tag}>{tag}</span>)}{selectedTags.length === 0 && <span>아직 넣은 재료가 없어요</span>}</div><div className={own.brewScene}><div className={styles.fallingIngredients} aria-hidden="true">{selectedTags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className={own.sparkOne} aria-hidden="true">✦</span><span className={own.sparkTwo} aria-hidden="true">✧</span><span className={own.sparkThree} aria-hidden="true">✦</span><img src={cauldronImage} alt={prescription || isBrewing ? "끓고 있는 연금술 솥" : "비어 있는 연금술 솥"} /></div>{missing && <p className={styles.warning} role="alert">{track ? "기반 감정을 하나 골라 주세요!" : "감정 계열을 먼저 골라 주세요!"}</p>}<div className={styles.potActions}><button type="button" onClick={combine} disabled={isBrewing}>{isBrewing ? "연성 중..." : "조합하기"}</button><button type="button" disabled={isBrewing} onClick={() => { setTrack(null); setEmotion(null); setSelectedTastes([]); setPrescription(null); setMissing(false); }}>비우기</button></div></section>
      <aside className={styles.result}><h2>사장님의 처방</h2><p>미리 정해 둔 메뉴 30종 중에서 골라요.</p>{prescription ? <><div className={styles.speech}><b>모카 사장님</b><span>오늘은 {prescription.emotion} 마음이군요. 지금 딱 어울리는 한 잔을 골라봤다냥.</span></div><div className={styles.candidates}>{prescription.menus.map((menu, index) => { const open = index === openIndex; return <article key={menu.name} className={`${styles.candidate} ${open ? styles.candidateOpen : ""}`}>
        <button type="button" className={styles.candidateHead} onClick={() => setOpenIndex(index)} aria-expanded={open}><span>{index === 0 ? "오늘의 처방 조합" : "다른 후보"}</span><b>{menu.name}</b><small>{menu.base} · {menu.price.toLocaleString()}원</small></button>
        {open && <div className={styles.candidateBody}><div className={styles.candidateTags}>{menu.emotions.map((item) => <b key={item}>✓ {item}</b>)}{menu.tastes.map((item) => <b key={item}>✓ {item}</b>)}</div><button type="button" className={styles.addCart} onClick={async () => { setAddedName(null); try { await addToCart({ name: menu.name, options: [menu.base], unitPrice: menu.price }); setAddedName(menu.name); } catch (error) { window.alert(error instanceof Error ? error.message : "담지 못했어요."); } }}>🛒 장바구니에 담기</button>{addedName === menu.name && <p className={styles.added} role="status">담았어요! <Link href="/cart">장바구니 보기 →</Link></p>}</div>}
      </article>; })}</div></> : <div className={styles.emptyResult}><p>아직 처방이 없어요.<br />기분과 맛을 넣고 조합하기를 눌러 주세요.</p></div>}</aside>
    </section>
    <section className={styles.how}><h2>이렇게 동작해요</h2><div><article><b>1단계 · 손님</b><h3>감정 1개 + 맛 0~2개 선택</h3><p>메뉴를 몰라도 지금 상태만 고르면 돼요. 감정 키워드는 팀 투표로 정한 6개예요.</p></article><article><b>2단계 · 서버</b><h3>메뉴마다 붙인 태그와 비교</h3><p>감정이 맞으면 3점, 맛이 하나 맞을 때마다 2점. 가장 높은 메뉴 한 가지를 골라요.</p></article><article><b>3단계 · 결과</b><h3>정해진 메뉴를 바로 주문</h3><p>결과는 항상 기본 메뉴 30종 중 하나라서 가격·재고·주문 흐름을 그대로 써요.</p></article></div></section>
  </AlchemyModeLayout>;
}
