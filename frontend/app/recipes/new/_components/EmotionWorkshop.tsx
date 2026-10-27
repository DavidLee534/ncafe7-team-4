"use client";
// 감정으로 레시피 만들기 — 왼쪽 감정 선반에서 지금 기분 하나와 끌리는 맛(0~2개)을 골라 오른쪽 연금솥에 넣고, 처방 받기를 누르면
// GET /api/v1/recipes/recommendations 로 어울리는 메뉴 4개를 받는다. 결과는 아코디언 — 맨 위 처방만 펼쳐 두고
// 나머지 후보는 이름 · 가격만 보이게 접는다. 다른 후보를 누르면 그것만 펼쳐진다. 펼친 칸에서 바로 장바구니에 담는다.
import { useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/apiClient";
import { won } from "@/lib/format";
import type { RecipeEmotions, RecipeRecommendation } from "@/lib/userApi";
import AddToCartButton from "../../../_components/AddToCartButton";
import catalog from "../../../_components/Catalog.module.css";
import styles from "./RecipeNew.module.css";

const MAX_TASTES = 2;

export default function EmotionWorkshop({ emotions, tastes }: RecipeEmotions) {
  const [emotion, setEmotion] = useState<string | null>(null);
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [missing, setMissing] = useState(false);
  const [brewing, setBrewing] = useState(false);
  const [result, setResult] = useState<{ emotion: string; menus: RecipeRecommendation[] } | null>(null);
  const [openIndex, setOpenIndex] = useState(0); // 펼쳐 둔 후보 하나. 처방을 새로 받으면 맨 위(오늘의 처방)

  function toggleTaste(taste: string) {
    setSelectedTastes((current) =>
      current.includes(taste) ? current.filter((item) => item !== taste) : current.length < MAX_TASTES ? [...current, taste] : current,
    );
  }

  function clear() {
    setEmotion(null);
    setSelectedTastes([]);
    setMissing(false);
    setResult(null);
  }

  async function prescribe() {
    if (!emotion) return setMissing(true);
    setBrewing(true);
    try {
      const query = new URLSearchParams({ emotion });
      if (selectedTastes.length > 0) query.set("tastes", selectedTastes.join(","));
      setResult({ emotion, menus: await apiGet<RecipeRecommendation[]>(`/api/v1/recipes/recommendations?${query}`) });
      setOpenIndex(0);
    } catch (error) {
      window.alert((error as Error).message);
    } finally {
      setBrewing(false);
    }
  }

  const chipClass = (active: boolean) => `${catalog.categoryChip} ${active ? catalog.categoryChipActive : ""}`;

  return (
    <div className={catalog.layout}>
      <div>
        <section className={catalog.controlPanel} style={{ marginTop: 0 }} aria-labelledby="emotion-title">
          <div className={catalog.panelHeading}>
            <div>
              <span className={catalog.eyebrow}>MOKA&apos;S EMOTION SHELF</span>
              <h2 id="emotion-title">감정 선반</h2>
            </div>
            <p>
              기분 <strong>1</strong>개와 맛을 <strong>{MAX_TASTES}</strong>개까지 골라요.
            </p>
          </div>

          <p className={`${catalog.groupLabel} ${missing && !emotion ? catalog.groupLabelMissing : ""}`}>
            ① 지금 기분 <small>필수 1개 · {emotion ? 1 : 0}/1</small>
          </p>
          <div className={catalog.categoryRail} role="group" aria-label="지금 기분">
            {emotions.map((item) => (
              <button
                key={item.name}
                type="button"
                className={chipClass(item.name === emotion)}
                aria-pressed={item.name === emotion}
                onClick={() => {
                  setEmotion(item.name);
                  setMissing(false);
                }}
              >
                <i style={{ background: item.color }} aria-hidden="true" />
                {item.name}
              </button>
            ))}
          </div>

          <p className={catalog.groupLabel}>
            ② 끌리는 맛{" "}
            <small>
              선택 · {selectedTastes.length}/{MAX_TASTES}
            </small>
          </p>
          <div className={catalog.categoryRail} role="group" aria-label="끌리는 맛">
            {tastes.map((taste) => {
              const active = selectedTastes.includes(taste);
              return (
                <button
                  key={taste}
                  type="button"
                  className={chipClass(active)}
                  aria-pressed={active}
                  disabled={!active && selectedTastes.length >= MAX_TASTES}
                  onClick={() => toggleTaste(taste)}
                >
                  {taste}
                </button>
              );
            })}
          </div>

        </section>

        {result && (
          <section className={catalog.controlPanel} aria-labelledby="prescription-title" aria-live="polite">
            <div className={catalog.panelHeading}>
              <div>
                <span className={catalog.eyebrow}>MOKA&apos;S PRESCRIPTION</span>
                <h2 id="prescription-title">오늘의 처방</h2>
              </div>
              <p>
                <strong>{result.emotion}</strong> 마음에 어울리는 메뉴를 골랐다냥.
              </p>
            </div>
            <ul className={styles.candidates}>
              {result.menus.map((menu, index) => {
                const open = index === openIndex;
                const bodyId = `candidate-${menu.menuId}`;
                return (
                  <li key={menu.menuId} className={`${styles.candidate} ${open ? styles.candidateOpen : ""}`}>
                    <button
                      type="button"
                      className={styles.candidateHead}
                      aria-expanded={open}
                      aria-controls={bodyId}
                      onClick={() => setOpenIndex(index)}
                    >
                      <span>{index === 0 ? "✦ 오늘의 처방" : "다른 후보"}</span>
                      <b>{menu.korName}</b>
                      <small>{won(menu.price)}</small>
                    </button>
                    {open && (
                      <div id={bodyId} className={styles.candidateBody}>
                        <p>
                          {menu.categoryName} · {menu.engName} · 궁합 {menu.score}점
                        </p>
                        {menu.description && <p>{menu.description}</p>}
                        <div className={catalog.tags}>
                          {[...menu.emotionTags, ...menu.tasteTags].map((tag) => (
                            <b key={tag}>✓ {tag}</b>
                          ))}
                        </div>
                        <div className={styles.candidateActions}>
                          {menu.slug && (
                            <Link href={`/menus/${menu.slug}`} className="m3-btn btn:text btn-size:xs">
                              메뉴 자세히
                            </Link>
                          )}
                          <AddToCartButton name={menu.korName} menuId={menu.menuId} />
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <aside className={catalog.diary} aria-labelledby="cauldron-title" aria-busy={brewing}>
        <div className={catalog.diaryHeader}>
          <span aria-hidden="true">⚗️</span>
          <div>
            <span className={catalog.eyebrow}>MOKA&apos;S CAULDRON</span>
            <h2 id="cauldron-title" className={catalog.diaryTitle}>
              연금솥
            </h2>
          </div>
        </div>

        <p className={catalog.diaryLead}>“메뉴 이름을 몰라도 괜찮다냥. 지금 기분만 넣어 주면 어울리는 메뉴를 골라 줄게!”</p>
        <div className={`${styles.cauldron} ${brewing ? styles.brewing : ""}`}>
          <img
            src={brewing || result ? "/images/alchemy-cauldron-brewing.png" : "/images/alchemy-cauldron-empty.png"}
            alt={brewing || result ? "끓고 있는 연금솥" : "비어 있는 연금솥"}
          />
        </div>

        {emotion && (
          <ul className={catalog.log}>
            <li>
              <span className={catalog.logDate}>기분</span>
              <span className={catalog.logName}>
                <i className={styles.emotionDot} style={{ background: emotions.find((item) => item.name === emotion)?.color }} aria-hidden="true" />
                {emotion}
              </span>
            </li>
            {selectedTastes.map((taste) => (
              <li key={taste}>
                <span className={catalog.logDate}>맛</span>
                <span className={catalog.logName}>{taste}</span>
              </li>
            ))}
          </ul>
        )}

        {missing && !emotion && (
          <p className={styles.warning} role="alert">
            지금 기분을 하나 골라 주세요!
          </p>
        )}
        <div className={styles.actions}>
          <button type="button" className="m3-btn" onClick={prescribe} disabled={brewing}>
            {brewing ? "처방 중…" : "처방 받기"}
          </button>
          <button type="button" className="m3-btn btn:outlined" onClick={clear} disabled={brewing}>
            비우기
          </button>
        </div>
        <p className={catalog.quote} style={{ marginTop: "1rem" }}>
          감정이 맞으면 +3점, 맛 하나마다 +2점.
          <br />
          판매 중인 메뉴에서 높은 순 4개를 골라요 🐾
        </p>
      </aside>
    </div>
  );
}
