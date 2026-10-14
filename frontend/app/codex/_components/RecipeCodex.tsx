"use client";

import { useRef, useState } from "react";
import { type CodexEntry, getBasicPotions, getSecretRecipes } from "@/lib/codex";
import UserHeader from "../../_components/UserHeader";
import CodexCard from "./CodexCard";
import CodexDetail from "./CodexDetail";
import CodexPager from "./CodexPager";
import MokaScenes from "./MokaScenes";
import StarField, { CodexStarDefs, STAR_SVG } from "./StarField";
import styles from "./RecipeCodex.module.css";

type Tab = "basic" | "secret";
type Filter = "all" | "found" | "locked" | "legend";

const PER_PAGE = 9; // 한 쪽에 3 x 3

export default function RecipeCodex() {
  const basics = getBasicPotions();
  const secrets = getSecretRecipes();
  const [tab, setTab] = useState<Tab>("basic");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(0);
  const [turnKey, setTurnKey] = useState(0);
  const [selected, setSelected] = useState<Record<Tab, number>>({ basic: 0, secret: 1 });
  const boardRef = useRef<HTMLDivElement>(null);

  const list: CodexEntry[] = tab === "basic" ? basics : secrets;
  const found = (items: CodexEntry[]) => items.filter((x) => x.foundAt).length;
  const legends = secrets.filter((x) => x.grade === "legend");
  const basicFound = found(basics);
  const secretFound = found(secrets);
  const percent = Math.floor(((basicFound + secretFound) / (basics.length + secrets.length)) * 100);

  const visible = list.filter((x) =>
    filter === "found" ? x.foundAt : filter === "locked" ? !x.foundAt : filter === "legend" ? x.kind === "secret" && x.grade === "legend" : true,
  );
  const pages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const entry = list[selected[tab]];

  const filters: [Filter, string, number][] = [
    ["all", "전체", list.length],
    ["found", "발견", found(list)],
    ["locked", "미발견", list.length - found(list)],
  ];
  if (tab === "secret") filters.push(["legend", "✦✦ 전설", legends.length]);

  function changeTab(next: Tab) {
    setTab(next);
    setFilter("all");
    setPage(0);
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
              <p data-star-avoid>한 번이라도 연성한 기본 포션은 도감에 기록돼요. 연금 공방에서 정해진 재료 조합을 정확히 맞히면 비밀 레시피도 열려요.</p>
            </div>
            <div className={styles.stats} data-star-avoid>
              <div className={styles.statRow}><span>연성한 기본 포션</span><b>{basicFound}<small> / {basics.length}</small></b></div>
              <div className={styles.statRow}><span>발견한 비밀 레시피</span><b>{secretFound}<small> / {secrets.length}</small></b></div>
              <div className={`${styles.statRow} ${styles.statLegend}`}><span>✦✦ 전설 레시피</span><b>{found(legends)}<small> / {legends.length}</small></b></div>
              <p>🐱 전설은 손님 백 명 중 두세 명만 찾았다냥.</p>
            </div>
          </div>
        </section>

        <div className={styles.ground}>
          <StarField seed={29} density={9000} className={styles.groundStars} />
          <MokaScenes boardRef={boardRef} percent={percent} />

          <div className={styles.board} ref={boardRef} data-star-avoid>
            <div className={styles.tabs} role="tablist" aria-label="도감 종류">
              <button type="button" role="tab" aria-selected={tab === "basic"} onClick={() => changeTab("basic")}>
                기본 포션<small>{basicFound}/{basics.length}</small>
              </button>
              <button type="button" role="tab" aria-selected={tab === "secret"} onClick={() => changeTab("secret")}>
                ✦ 비밀 레시피<small>{secretFound}/{secrets.length}</small>
              </button>
            </div>
            <div className={styles.inner}>
              <section className={styles.list} aria-label="도감 목록">
                <div className={styles.filters} role="group" aria-label="보기">
                  {filters.map(([key, label, count]) => (
                    <button key={key} type="button" aria-pressed={filter === key} onClick={() => { setFilter(key); setPage(0); }}>
                      {label} <b>{count}</b>
                    </button>
                  ))}
                </div>
                <div key={turnKey} className={`${styles.grid} ${turnKey > 0 ? styles.turn : ""}`}>
                  {visible.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE).map((item) => (
                    <CodexCard
                      key={`${item.kind}-${item.no}`}
                      entry={item}
                      selected={item === entry}
                      onSelect={() => setSelected((prev) => ({ ...prev, [tab]: item.no - 1 }))}
                    />
                  ))}
                  {visible.length === 0 && <p className={styles.meta}>이 조건에 맞는 항목이 없어요.</p>}
                </div>
                <CodexPager page={current} pages={pages} onChange={turnPage} />
              </section>
              <aside className={styles.detail} aria-live="polite">
                <div className={styles.detailSticky}>
                  <CodexDetail entry={entry} hiddenSecrets={secrets.length - secretFound} />
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
