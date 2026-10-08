"use client";

import Link from "next/link";
import { useState } from "react";
import type { Menu } from "@/lib/types";
import { MENU_STATUS, won } from "@/lib/format";
import styles from "./RecipeBook.module.css";

const CATEGORY_BOOKS: Record<number, { theme: string; icon: string; kicker: string; title: string; story: string; menuLabel: string }> = {
  1: { theme: "coffee", icon: "☕", kicker: "EMBER & ESPRESSO", title: "황금 오븐의 커피 주문", story: "치즈 총괄 마법사가\n새벽의 불꽃으로 추출한 진한 주문이에요.", menuLabel: "에스프레소 마법사의 추천" },
  2: { theme: "tea", icon: "🍵", kicker: "HERB MOON INFUSION", title: "달빛 허브 티포트", story: "삼색이 허브 마법사가\n정원에서 고른 향긋한 잎을 우려요.", menuLabel: "허브 마법사의 추천" },
  3: { theme: "ade", icon: "🍹", kicker: "BUBBLE JELLY LAB", title: "반짝이는 젤리 물약", story: "톡톡 터지는 과일 젤리에\n달빛 탄산을 한 스푼 더했어요.", menuLabel: "젤리 물약 공방의 추천" },
  4: { theme: "dessert", icon: "🧁", kicker: "SWEET PAW PATISSERIE", title: "발바닥 디저트 상자", story: "턱시도 반죽 마법사의\n정교한 젤리 압력이 만든 달콤함이에요.", menuLabel: "디저트 공방의 추천" },
  5: { theme: "seasonal", icon: "🌙", kicker: "LIMITED MOONLIGHT SPELL", title: "계절 한정 비밀 주문", story: "보름달이 뜨는 밤에만\n펼쳐 볼 수 있는 한정 레시피예요.", menuLabel: "모카 점장의 한정 추천" },
};

export default function RecipeBook({ menus, admin = false, overview = false, categoryId }: { menus: Menu[]; admin?: boolean; overview?: boolean; categoryId?: number }) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [turnKey, setTurnKey] = useState(0);
  const menu = menus[page];
  const categoryBook = categoryId ? CATEGORY_BOOKS[categoryId] : undefined;
  const detailStatus = menu ? MENU_STATUS[menu.status] : undefined;

  function turn(nextPage: number) {
    setDirection(nextPage > page ? "next" : "prev");
    setPage(nextPage);
    setTurnKey((key) => key + 1);
  }

  if (!menu) return null;

  if (overview) {
    const menusPerSpread = 4;
    const totalSpreads = Math.ceil(menus.length / menusPerSpread);
    const spreadMenus = menus.slice(page * menusPerSpread, (page + 1) * menusPerSpread);
    const pages = [spreadMenus.slice(0, 2), spreadMenus.slice(2, 4)];
    return (
      <section className={styles.stage} aria-label="펼쳐진 비밀 레시피북 메뉴 목록">
        <div key={turnKey} className={`${styles.book} ${styles.overviewBook} ${direction === "next" ? styles.turnNext : styles.turnPrev}`}>
          {turnKey > 0 && <span className={styles.turningSheet} aria-hidden="true" />}
          {pages.map((bookPage, pageIndex) => (
            <article key={pageIndex} className={styles.listPage}>
              <span className={styles.chapter}>MENU INDEX · {String(page * 2 + pageIndex + 1).padStart(2, "0")}</span>
              <h2>{pageIndex === 0 ? "오늘의 메뉴" : "계속되는 레시피"}</h2>
              <ul className={styles.menuIndex}>
                {bookPage.map((item, itemIndex) => (
                  (() => {
                    const status = MENU_STATUS[item.status];
                    const row = (
                      <>
                        <span className={styles.indexNumber}>{String(page * menusPerSpread + pageIndex * 2 + itemIndex + 1).padStart(2, "0")}</span>
                        {item.image ? <img src={item.image} alt="" /> : <span className={styles.indexPlaceholder}>🍞</span>}
                        <span className={styles.indexName}><b>{item.korName}</b><small>{item.engName}</small></span>
                        <span className={`${styles.indexStatus} ${styles[`status${item.status}`]}`}>{status.label}</span>
                        <strong>{won(item.price)}</strong>
                      </>
                    );
                    return <li key={item.id}>{admin ? <Link href={`/admin/menus/${item.id}`} className={styles.indexRow} aria-label={`${item.korName} 관리`}>{row}</Link> : <div className={styles.indexRow}>{row}</div>}</li>;
                  })()
                ))}
              </ul>
              <span className={styles.pageNumber}>{page * 2 + pageIndex + 1}</span>
            </article>
          ))}
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={() => turn(page - 1)} disabled={page === 0}>← 이전 장</button>
          <p><b>{page + 1}</b> / {totalSpreads} · 한 장에 네 가지 메뉴</p>
          <button type="button" onClick={() => turn(page + 1)} disabled={page === totalSpreads - 1}>다음 장 →</button>
        </div>
        <p className={styles.indexHint}>원하는 메뉴의 ↗ 버튼을 누르면 레시피 관리 페이지로 이동합니다.</p>
      </section>
    );
  }

  return (
    <section className={styles.stage} aria-label="비밀 레시피북 메뉴판">
      <div key={turnKey} className={`${styles.book} ${categoryBook ? styles[`theme${categoryBook.theme}`] : ""} ${direction === "next" ? styles.turnNext : styles.turnPrev}`}>
        {turnKey > 0 && <span className={styles.turningSheet} aria-hidden="true" />}
        <article className={styles.leftPage}>
          <span className={styles.chapter}>{categoryBook?.kicker ?? "SECRET RECIPE"} · {String(page + 1).padStart(2, "0")}</span>
          <div className={styles.magicSeal} aria-hidden="true">{categoryBook?.icon ?? "🐾"}</div>
          <p className={styles.spellName}>{categoryBook?.title ?? "MOONLIGHT BAKERY"}</p>
          <p className={styles.story}>{(categoryBook?.story ?? "고양이 마법사들이 정성껏 고른\n오늘의 한 페이지예요.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</p>
          <span className={styles.pageNumber}>{page + 1}</span>
        </article>
        <article className={styles.rightPage}>
          {admin && <Link href={`/admin/menus/${menu.id}`} className={styles.detailPageLink} aria-label={`${menu.korName} 관리`} />}
          <span className={styles.category}>{categoryBook?.menuLabel ?? "냥이 발자국 빵집 추천"}</span>
          <div className={styles.menuImage}>{menu.image ? <img src={menu.image} alt={menu.korName} /> : "🍞"}</div>
          <h2>{menu.korName}</h2>
          <p className={styles.english}>{menu.engName}</p>
          {detailStatus && <span className={`${styles.detailStatus} ${styles[`status${menu.status}`]}`}>{detailStatus.label}</span>}
          <p className={styles.description}>{menu.description}</p>
          <strong>{won(menu.price)}</strong>
          {admin && <span className={styles.detailHint}>이 페이지를 누르면 레시피 관리로 이동해요 ↗</span>}
          <span className={styles.pageNumber}>{page + 2}</span>
        </article>
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={() => turn(page - 1)} disabled={page === 0}>← 이전 장</button>
        <p><b>{page + 1}</b> / {menus.length} · 책장을 넘겨 보세요 ✦</p>
        <button type="button" onClick={() => turn(page + 1)} disabled={page === menus.length - 1}>다음 장 →</button>
      </div>
    </section>
  );
}
