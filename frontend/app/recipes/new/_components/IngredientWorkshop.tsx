"use client";
// 재료로 레시피 만들기 — 왼쪽 재료 선반(계열 → 필수 재료 → 추가 재료)에서 고르고, 오른쪽 연금솥에서 조합한다.
// 조합하기를 누르면 POST /api/v1/recipes 로 포션을 만들어 도감에 저장하고, 결과 카드에서 장바구니에 담는다.
// 이름 · 등급 · 가격은 서버가 정한다 (비밀 레시피를 맞히면 전설 등급). 화면은 예상 가격만 미리 더해 보여준다.
import { useState } from "react";
import { apiSend } from "@/lib/apiClient";
import { RECIPE_GRADE, won } from "@/lib/format";
import type { CreatedRecipe, IngredientShelf } from "@/lib/userApi";
import AddToCartButton from "../../../_components/AddToCartButton";
import catalog from "../../../_components/Catalog.module.css";
import styles from "./RecipeNew.module.css";

const MAX_EXTRAS = 3;

// 메뉴 상세의 "조합하기"(?menuId=)로 오면 그 메뉴가 든 계열과 그 메뉴의 필수 재료를 골라 둔다
function startingPoint(shelves: IngredientShelf[], menuId?: number) {
  const shelf = menuId ? shelves.find((item) => item.bases.some((base) => base.menuId === menuId)) : undefined;
  return { categoryId: shelf?.categoryId ?? null, baseId: shelf ? menuId! : null };
}

export default function IngredientWorkshop({ shelves, initialMenuId }: { shelves: IngredientShelf[]; initialMenuId?: number }) {
  const [start] = useState(() => startingPoint(shelves, initialMenuId));
  const [categoryId, setCategoryId] = useState<number | null>(start.categoryId);
  const [baseId, setBaseId] = useState<number | null>(start.baseId);
  const [extras, setExtras] = useState<string[]>([]);
  const [missing, setMissing] = useState<"category" | "base" | null>(null);
  const [brewing, setBrewing] = useState(false);
  const [potion, setPotion] = useState<CreatedRecipe | null>(null);

  const shelf = shelves.find((item) => item.categoryId === categoryId) ?? null;
  const base = shelf?.bases.find((item) => item.menuId === baseId) ?? null;
  const chosenExtras = shelf ? shelf.extras.filter((item) => extras.includes(item.name)) : [];
  const estimate = base ? base.price + chosenExtras.reduce((sum, item) => sum + item.price, 0) : null;

  function selectCategory(id: number) {
    setCategoryId(id);
    setBaseId(null);
    setExtras([]);
    setMissing(null);
    setPotion(null);
  }

  function selectBase(id: number) {
    setBaseId(id);
    setMissing(null);
    setPotion(null);
  }

  function toggleExtra(name: string) {
    setExtras((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : current.length < MAX_EXTRAS ? [...current, name] : current,
    );
    setPotion(null);
  }

  function clear() {
    setBaseId(null);
    setExtras([]);
    setMissing(null);
    setPotion(null);
  }

  async function brew() {
    if (!shelf) return setMissing("category");
    if (!base) return setMissing("base");
    setBrewing(true);
    try {
      setPotion(await apiSend<CreatedRecipe>("POST", "/api/v1/recipes", { baseMenuId: base.menuId, extras }));
    } catch (error) {
      window.alert((error as Error).message);
    } finally {
      setBrewing(false);
    }
  }

  const chipClass = (active: boolean) => `${catalog.categoryChip} ${active ? catalog.categoryChipActive : ""}`;

  return (
    <div className={catalog.layout}>
      <section className={catalog.controlPanel} style={{ marginTop: 0 }} aria-labelledby="shelf-title">
        <div className={catalog.panelHeading}>
          <div>
            <span className={catalog.eyebrow}>MOKA&apos;S INGREDIENT SHELF</span>
            <h2 id="shelf-title">재료 선반</h2>
          </div>
          <p>
            필수 재료 <strong>1</strong>개에 추가 재료를 <strong>{MAX_EXTRAS}</strong>개까지 더해요.
          </p>
        </div>

        <p className={`${catalog.groupLabel} ${missing === "category" ? catalog.groupLabelMissing : ""}`}>
          ① 계열 <small>필수 · {shelf ? shelf.spell : "하나를 골라 주세요"}</small>
        </p>
        <div className={catalog.categoryRail} role="group" aria-label="계열">
          {shelves.map((item) => (
            <button
              key={item.categoryId}
              type="button"
              className={chipClass(item.categoryId === categoryId)}
              aria-pressed={item.categoryId === categoryId}
              onClick={() => selectCategory(item.categoryId)}
            >
              {item.categoryName} <span>{item.bases.length}</span>
            </button>
          ))}
        </div>

        {/* 계열을 고른 뒤에만 그 계열의 필수 재료 · 추가 재료를 보여준다 */}
        {shelf && (
          <>
            <p className={`${catalog.groupLabel} ${missing === "base" ? catalog.groupLabelMissing : ""}`}>
              ② 필수 재료 <small>필수 1개 · {base ? 1 : 0}/1</small>
            </p>
            <div className={catalog.categoryRail} role="group" aria-label="필수 재료">
              {shelf.bases.map((item) => (
                <button
                  key={item.menuId}
                  type="button"
                  className={chipClass(item.menuId === baseId)}
                  aria-pressed={item.menuId === baseId}
                  title={item.menuName}
                  onClick={() => selectBase(item.menuId)}
                >
                  {item.ingredientName} <small className={styles.extraPrice}>{won(item.price)}</small>
                </button>
              ))}
            </div>

            <p className={catalog.groupLabel}>
              ③ 추가 재료{" "}
              <small>
                선택 · {extras.length}/{MAX_EXTRAS}
              </small>
            </p>
            <div className={catalog.categoryRail} role="group" aria-label="추가 재료">
              {shelf.extras.map((item) => {
                const active = extras.includes(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={chipClass(active)}
                    aria-pressed={active}
                    disabled={!active && extras.length >= MAX_EXTRAS}
                    onClick={() => toggleExtra(item.name)}
                  >
                    {item.icon} {item.name} <small className={styles.extraPrice}>+{won(item.price)}</small>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

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

        <p className={catalog.diaryLead}>“재료를 넣어 주면 모카가 세상에 하나뿐인 포션을 끓여 줄게냥!”</p>
        <div className={`${styles.cauldron} ${brewing ? styles.brewing : ""}`}>
          <img
            src={brewing || potion ? "/images/alchemy-cauldron-brewing.png" : "/images/alchemy-cauldron-empty.png"}
            alt={brewing || potion ? "끓고 있는 연금솥" : "비어 있는 연금솥"}
          />
        </div>

        {base && (
          <ul className={catalog.log}>
            <li>
              <span className={catalog.logDate}>필수</span>
              <span className={catalog.logName}>{base.ingredientName}</span>
              <span className={catalog.logText}>{won(base.price)}</span>
            </li>
            {chosenExtras.map((item) => (
              <li key={item.name}>
                <span className={catalog.logDate}>추가</span>
                <span className={catalog.logName}>
                  {item.icon} {item.name}
                </span>
                <span className={catalog.logText}>+{won(item.price)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.estimate}>
          예상 가격 <b>{estimate === null ? "—" : won(estimate)}</b>
        </p>
        {missing && (
          <p className={styles.warning} role="alert">
            {missing === "category" ? "계열을 먼저 골라 주세요!" : "필수 재료를 하나 골라 주세요!"}
          </p>
        )}
        <div className={styles.actions}>
          <button type="button" className="m3-btn" onClick={brew} disabled={brewing}>
            {brewing ? "연성 중…" : "조합하기"}
          </button>
          <button type="button" className="m3-btn btn:outlined" onClick={clear} disabled={brewing}>
            비우기
          </button>
        </div>

        {potion && (
          <article className={styles.result} aria-live="polite">
            <span className={`m3-badge badge:inline badge-color:${RECIPE_GRADE[potion.grade].color}`}>
              {RECIPE_GRADE[potion.grade].label} 등급
            </span>
            <h3>
              <i style={{ background: potion.color }} aria-hidden="true" />
              {potion.name}
            </h3>
            <p>
              {[potion.baseIngredientName, ...potion.extras].join(" · ")} · {won(potion.price)}
            </p>
            {potion.secretRecipeName && (
              <p className={styles.secret}>
                {potion.newlyDiscovered
                  ? `✦ 비밀 레시피 '${potion.secretRecipeName}'를 처음 발견했어요!`
                  : `✦ 이미 찾은 비밀 레시피 '${potion.secretRecipeName}'예요.`}
              </p>
            )}
            <p>도감에 기록했어요.</p>
            <AddToCartButton name={potion.name} options={[potion.baseIngredientName, ...potion.extras]} unitPrice={potion.price} />
          </article>
        )}
      </aside>
    </div>
  );
}
