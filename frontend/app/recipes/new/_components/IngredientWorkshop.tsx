"use client";
// 재료로 레시피 만들기 — 왼쪽 재료 선반(계열 → 기반 재료 → 추가 재료 선반)에서 고르고, 오른쪽 연금솥에서 조합한다.
// 추가 재료는 계열에 열린 선반마다 정해진 개수(min~max)만큼, 티 블렌딩의 과일청 · 허브는 묶음마다 하나까지 고른다.
// 조합하기를 누르면 POST /api/v1/recipes 로 포션을 만들어 도감에 저장하고, 결과 카드에서 장바구니에 담는다.
// 이름 · 등급 · 색 · 가격은 서버가 정한다 (같은 규칙을 서버가 다시 검사한다). 화면은 예상 가격만 미리 더해 보여준다.
import { useState } from "react";
import { apiSend } from "@/lib/apiClient";
import { RECIPE_GRADE, won } from "@/lib/format";
import type { CreatedRecipe, IngredientExtra, IngredientShelf } from "@/lib/userApi";
import AddToCartButton from "../../../_components/AddToCartButton";
import catalog from "../../../_components/Catalog.module.css";
import styles from "./RecipeNew.module.css";

type ExtraShelf = IngredientShelf["shelves"][number];

// 메뉴 상세의 "조합하기"(?menuId=)로 오면 그 메뉴가 든 계열과 그 메뉴의 기반 재료를 골라 둔다
function startingPoint(lines: IngredientShelf[], menuId?: number) {
  const line = menuId ? lines.find((item) => item.bases.some((base) => base.menuId === menuId)) : undefined;
  return { categoryId: line?.categoryId ?? null, baseId: line ? menuId! : null };
}

export default function IngredientWorkshop({ shelves: lines, initialMenuId }: { shelves: IngredientShelf[]; initialMenuId?: number }) {
  const [start] = useState(() => startingPoint(lines, initialMenuId));
  const [categoryId, setCategoryId] = useState<number | null>(start.categoryId);
  const [baseId, setBaseId] = useState<number | null>(start.baseId);
  const [extraIds, setExtraIds] = useState<number[]>([]);
  const [missing, setMissing] = useState<string | null>(null);
  const [brewing, setBrewing] = useState(false);
  const [potion, setPotion] = useState<CreatedRecipe | null>(null);

  const line = lines.find((item) => item.categoryId === categoryId) ?? null;
  const base = line?.bases.find((item) => item.menuId === baseId) ?? null;
  const chosen = line ? line.shelves.flatMap((shelf) => shelf.extras.filter((extra) => extraIds.includes(extra.id)).map((extra) => ({ shelf, extra }))) : [];
  const estimate = base ? base.price + chosen.reduce((sum, item) => sum + item.extra.price, 0) : null;

  const countIn = (shelf: ExtraShelf) => shelf.extras.filter((extra) => extraIds.includes(extra.id)).length;
  // 선반이 가득 찼거나, 같은 묶음(과일청 · 허브)에서 이미 하나를 골랐으면 더 고를 수 없다
  const blocked = (shelf: ExtraShelf, extra: IngredientExtra) =>
    countIn(shelf) >= shelf.max ||
    (extra.group !== null && shelf.extras.some((other) => other.group === extra.group && other.id !== extra.id && extraIds.includes(other.id)));

  function selectCategory(id: number) {
    setCategoryId(id);
    setBaseId(null);
    setExtraIds([]);
    setMissing(null);
    setPotion(null);
  }

  function selectBase(id: number) {
    setBaseId(id);
    setMissing(null);
    setPotion(null);
  }

  function toggleExtra(shelf: ExtraShelf, extra: IngredientExtra) {
    setExtraIds((current) =>
      current.includes(extra.id) ? current.filter((id) => id !== extra.id) : blocked(shelf, extra) ? current : [...current, extra.id],
    );
    setMissing(null);
    setPotion(null);
  }

  function clear() {
    setBaseId(null);
    setExtraIds([]);
    setMissing(null);
    setPotion(null);
  }

  async function brew() {
    if (!line) return setMissing("계열을 먼저 골라 주세요!");
    if (!base) return setMissing("기반 재료를 하나 골라 주세요!");
    const short = line.shelves.find((shelf) => countIn(shelf) < shelf.min);
    if (short) return setMissing(`${short.name}를 ${short.min}개 이상 골라 주세요!`);
    setBrewing(true);
    try {
      setPotion(await apiSend<CreatedRecipe>("POST", "/api/v1/recipes", { baseMenuId: base.menuId, extraIds }));
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
            기반 재료 <strong>1</strong>개에 선반마다 정해진 만큼 추가 재료를 더해요.
          </p>
        </div>

        <p className={`${catalog.groupLabel} ${missing && !line ? catalog.groupLabelMissing : ""}`}>
          ① 계열 <small>필수 · {line ? line.spell : "하나를 골라 주세요"}</small>
        </p>
        <div className={catalog.categoryRail} role="group" aria-label="계열">
          {lines.map((item) => (
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

        {/* 계열을 고른 뒤에만 그 계열의 기반 재료 · 추가 재료 선반을 보여준다 */}
        {line && (
          <>
            <p className={`${catalog.groupLabel} ${missing && line && !base ? catalog.groupLabelMissing : ""}`}>
              ② 기반 재료 <small>필수 1개 · {base ? 1 : 0}/1</small>
            </p>
            <div className={catalog.categoryRail} role="group" aria-label="기반 재료">
              {line.bases.map((item) => (
                <button
                  key={item.menuId}
                  type="button"
                  className={chipClass(item.menuId === baseId)}
                  aria-pressed={item.menuId === baseId}
                  title={`${item.menuName} · ${item.alchemyName}`}
                  onClick={() => selectBase(item.menuId)}
                >
                  {item.ingredientName} <small className={styles.extraPrice}>{won(item.price)}</small>
                </button>
              ))}
            </div>

            {line.shelves.map((shelf, index) => {
              const count = countIn(shelf);
              return (
                <div key={shelf.name}>
                  <p className={`${catalog.groupLabel} ${missing && count < shelf.min ? catalog.groupLabelMissing : ""}`}>
                    {String.fromCharCode(0x2462 + index)} {shelf.icon} {shelf.name}{" "}
                    <small>
                      {shelf.min > 0 ? `필수 ${shelf.min}~${shelf.max}개` : `선택 · ${shelf.max}개까지`} · {count}/{shelf.max}
                      {shelf.extras.some((extra) => extra.group) && " · 과일청 1 + 허브 1"}
                    </small>
                  </p>
                  <div className={catalog.categoryRail} role="group" aria-label={shelf.name}>
                    {shelf.extras.map((extra) => {
                      const active = extraIds.includes(extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          className={chipClass(active)}
                          aria-pressed={active}
                          title={extra.modifier ?? undefined}
                          disabled={!active && blocked(shelf, extra)}
                          onClick={() => toggleExtra(shelf, extra)}
                        >
                          {extra.name} <small className={styles.extraPrice}>+{won(extra.price)}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
              <span className={catalog.logDate}>기반</span>
              <span className={catalog.logName}>{base.ingredientName}</span>
              <span className={catalog.logText}>{won(base.price)}</span>
            </li>
            {chosen.map(({ shelf, extra }) => (
              <li key={extra.id}>
                <span className={catalog.logDate}>추가</span>
                <span className={catalog.logName}>
                  {shelf.icon} {extra.name}
                </span>
                <span className={catalog.logText}>+{won(extra.price)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.estimate}>
          예상 가격 <b>{estimate === null ? "—" : won(estimate)}</b>
        </p>
        {missing && (
          <p className={styles.warning} role="alert">
            {missing}
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
            <AddToCartButton name={potion.name} recipeId={potion.id} />
          </article>
        )}
      </aside>
    </div>
  );
}
