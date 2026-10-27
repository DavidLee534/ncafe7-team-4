"use client";
// 레시피 도감 화면. 받은 목록(내가 빚은 포션, 비밀 레시피)과 요약을 탭·필터·쪽으로 나눠 보여 준다.
// 필터(전체·발견·미발견·전설 등)는 데이터가 작아서 화면에서 거른다.
// 탭과 고른 칸은 주소(?tab=secret&id=2)에 남겨서 새로고침하거나 링크를 보내도 같은 칸이 열린다.
import { useRef, useState } from "react";
import type { MyCodexSummary, MyRecipe, MySecretRecipe } from "@/lib/myApi";
import UserHeader from "../../../_components/UserHeader";
import CodexCard, { type CodexEntry } from "./CodexCard";
import CodexDetail from "./CodexDetail";
import CodexPager from "./CodexPager";
import MokaScenes from "./MokaScenes";
import StarField, { CodexStarDefs, STAR_SVG } from "./StarField";
import styles from "./RecipeCodex.module.css";

export type CodexTab = "basic" | "secret";
type Filter = "all" | "normal" | "rare" | "legend" | "secretCombo" | "found" | "locked";

const PER_PAGE = 9; // 한 쪽에 3 x 3

type Props = {
  recipes: MyRecipe[];
  secrets: MySecretRecipe[];
  summary: MyCodexSummary;
  initialTab: CodexTab;
  initialId?: number;
};

export default function RecipeCodex({ recipes, secrets, summary, initialTab, initialId }: Props) {
  const entries: Record<CodexTab, CodexEntry[]> = {
    basic: recipes.map((item) => ({ kind: "recipe", item })),
    secret: secrets.map((item) => ({ kind: "secret", item })),
  };
  const firstIndex = (tab: CodexTab) => {
    const index = initialTab === tab && initialId ? entries[tab].findIndex((e) => e.item.id === initialId) : -1;
    return Math.max(0, index);
  };

  const [tab, setTab] = useState<CodexTab>(initialTab);
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(() => Math.floor(firstIndex(initialTab) / PER_PAGE));
  const [turnKey, setTurnKey] = useState(0);
  const [selected, setSelected] = useState<Record<CodexTab, number>>({ basic: firstIndex("basic"), secret: firstIndex("secret") });
  const boardRef = useRef<HTMLDivElement>(null);

  const list = entries[tab];
  const visible = list.filter((e) => matchesWith(e, filter));
  const pages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const entry = list[selected[tab]];
  const hiddenSecrets = summary.secretTotal - summary.secretFound;

  const filters: [Filter, string][] =
    tab === "basic"
      ? [["all", "전체"], ["normal", "일반"], ["rare", "✦ 희귀"], ["legend", "✦✦ 전설"], ["secretCombo", "비밀 조합"]]
      : [["all", "전체"], ["found", "발견"], ["locked", "미발견"], ["legend", "✦✦ 전설"]];

  // 주소에 지금 탭과 칸을 남긴다 (페이지를 다시 불러오지 않고 주소만 바꾼다)
  function remember(nextTab: CodexTab, id?: number) {
    const query = new URLSearchParams();
    if (nextTab === "secret") query.set("tab", "secret");
    if (id) query.set("id", String(id));
    window.history.replaceState(null, "", query.size > 0 ? `/my/recipes?${query}` : "/my/recipes");
  }

  function changeTab(next: CodexTab) {
    setTab(next);
    setFilter("all");
    setPage(0);
    remember(next, entries[next][selected[next]]?.item.id);
  }

  function select(e: CodexEntry) {
    const index = list.indexOf(e);
    setSelected((prev) => ({ ...prev, [tab]: index }));
    remember(tab, e.item.id);
  }

  function turnPage(next: number) {
    setPage(next);
    setTurnKey((key) => key + 1);
  }

  return (
    <>
      <UserHeader />
      <main className={styles.page}>
        <CodexStarDefs />

        <section className={styles.sky}>
          <StarField seed={11} density={5200} className={styles.starfield} />
          <div className={styles.hero}>
            <div>
              <div className={styles.eyebrow} data-star-avoid>MOKA&apos;S POTION CODEX</div>
              <h1 data-star-avoid>내가 빚은 포션과<br /><em>숨겨진 레시피</em>를 모아 보세요</h1>
              <p data-star-avoid>연금 공방에서 빚은 포션은 도감에 기록돼요. 정해진 재료 조합을 정확히 맞히면 비밀 레시피도 열려요.</p>
            </div>
            <div className={styles.stats} data-star-avoid>
              <div className={styles.statRow}><span>내가 빚은 포션</span><b>{summary.recipeCount}<small> 개</small></b></div>
              <div className={styles.statRow}><span>발견한 비밀 레시피</span><b>{summary.secretFound}<small> / {summary.secretTotal}</small></b></div>
              <div className={`${styles.statRow} ${styles.statLegend}`}><span>✦✦ 전설 레시피</span><b>{summary.legendFound}<small> / {summary.legendTotal}</small></b></div>
              <p>🐱 전설은 손님 백 명 중 두세 명만 찾았다냥.</p>
            </div>
          </div>
        </section>

        <div className={styles.ground}>
          <StarField seed={29} density={9000} className={styles.groundStars} />
          <MokaScenes boardRef={boardRef} percent={summary.progressRate} />

          <div className={styles.board} ref={boardRef} data-star-avoid>
            <div className={styles.tabs} role="tablist" aria-label="도감 종류">
              <button type="button" role="tab" aria-selected={tab === "basic"} onClick={() => changeTab("basic")}>
                내가 빚은 포션<small>{recipes.length}</small>
              </button>
              <button type="button" role="tab" aria-selected={tab === "secret"} onClick={() => changeTab("secret")}>
                ✦ 비밀 레시피<small>{summary.secretFound}/{summary.secretTotal}</small>
              </button>
            </div>
            <div className={styles.inner}>
              <section className={styles.list} aria-label="도감 목록">
                <div className={styles.filters} role="group" aria-label="보기">
                  {filters.map(([key, label]) => (
                    <button key={key} type="button" aria-pressed={filter === key} onClick={() => { setFilter(key); setPage(0); }}>
                      {label} <b>{list.filter((e) => matchesWith(e, key)).length}</b>
                    </button>
                  ))}
                </div>
                <div key={turnKey} className={`${styles.grid} ${turnKey > 0 ? styles.turn : ""}`}>
                  {visible.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE).map((e) => (
                    <CodexCard
                      key={`${e.kind}-${e.item.id}`}
                      entry={e}
                      no={list.indexOf(e) + 1}
                      selected={e === entry}
                      onSelect={() => select(e)}
                    />
                  ))}
                  {visible.length === 0 && (
                    <p className={styles.meta}>
                      {list.length === 0 && tab === "basic" ? "아직 빚은 포션이 없어요. 연금 공방에서 첫 포션을 빚어 보세요." : "이 조건에 맞는 항목이 없어요."}
                    </p>
                  )}
                </div>
                <CodexPager page={current} pages={pages} onChange={turnPage} />
              </section>
              <aside className={styles.detail} aria-live="polite">
                <div className={styles.detailSticky}>
                  {entry ? (
                    <CodexDetail entry={entry} hiddenSecrets={hiddenSecrets} />
                  ) : (
                    <p className={styles.meta}>왼쪽에서 포션을 고르면 여기에 기록이 보여요.</p>
                  )}
                </div>
              </aside>
            </div>
          </div>

          <footer className={styles.closing} data-star-avoid>
            <div className={styles.closingLine} aria-hidden="true" dangerouslySetInnerHTML={{ __html: STAR_SVG }} />
            <p>오늘도 좋은 연성 되라냥.</p>
            <small>MOKA&apos;S ALCHEMY CAFE · 냥금술 공방</small>
          </footer>
        </div>
      </main>
    </>
  );
}

// 필터 하나에 맞는지 (칩 옆 개수와 목록 거르기에 같이 쓴다)
function matchesWith(e: CodexEntry, filter: Filter): boolean {
  if (filter === "all") return true;
  if (e.kind === "recipe") {
    if (filter === "secretCombo") return e.item.secret;
    return e.item.grade === filter;
  }
  if (filter === "found") return e.item.discovered;
  if (filter === "locked") return !e.item.discovered;
  return e.item.grade === filter;
}
