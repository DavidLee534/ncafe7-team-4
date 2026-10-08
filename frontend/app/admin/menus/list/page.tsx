// 메뉴 목록 — 밤하늘 헤더(고양이) · 상태별 통계 · 필터(카테고리/상태/이름) · 메뉴 카드 · 냥일지.
// 필터는 GET 폼이라 주소의 쿼리(?category=1&status=on&keyword=라떼)로 남는다. 데이터는 목업.
import Link from "next/link";
import StatCard, { type Stat } from "../../_components/StatCard";
import NightHero, { heroOverlap } from "../../_components/NightHero";
import MenuCatalogCard from "../_components/MenuCatalogCard";
import CatDiary from "../_components/CatDiary";
import { countMenusByStatus, getCategories, getCategory, getMenus } from "@/lib/mock";
import { MENU_STATUS } from "@/lib/format";
import styles from "../_components/MenuCatalog.module.css";
import type { MenuStatus } from "@/lib/types";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminMenuListPage(props: PageProps<"/admin/menus/list">) {
  const sp = await props.searchParams;
  const category = one(sp.category);
  const status = one(sp.status);
  const keyword = one(sp.keyword);

  const menus = getMenus({
    categoryId: Number(category) || undefined,
    status: status in MENU_STATUS ? (status as MenuStatus) : undefined,
    keyword,
  });
  const categories = getCategories();
  const counts = countMenusByStatus();
  const stats: Stat[] = [
    { label: "전체 메뉴", value: String(counts.all) },
    { label: "판매 중", value: String(counts.on) },
    { label: "품절", value: String(counts.soldout) },
    { label: "비공개", value: String(counts.hidden) },
  ];

  return (
    <>
      <NightHero
        cat
        crumb="KITCHEN"
        title="메뉴 목록"
        description="고양이 바리스타의 특별한 한 잔을 관리하세요."
        actions={
          <>
            <div className={styles.boss}>
              <span className={styles.bossFace} aria-hidden="true">
                🐱
              </span>
              <div>
                <span className={styles.bossName}>모찌 점장 출근 중</span>
                <span className={styles.bossMood}>오늘의 기분: 간식이 필요해요</span>
              </div>
            </div>
            <Link href="/admin/menus/create" className="m3-btn btn-size:md btn-icon:leading">
              <i className="m3-icon icon:add" aria-hidden="true"></i>
              메뉴 등록
            </Link>
          </>
        }
      />

      <ul className={`m3-grid grid-cols:4 grid-gap:3 margin-bottom:6 ${heroOverlap}`}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </ul>

      <form className="m3-toolbar toolbar:fill" role="search" aria-label="메뉴 검색">
        <div className="m3-text-field field:outlined field-label:none width:ex" style={{ "--width-ex": "11rem" }}>
          <select name="category" defaultValue={category} aria-label="카테고리">
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="m3-text-field field:outlined field-label:none width:ex" style={{ "--width-ex": "9rem" }}>
          <select name="status" defaultValue={status} aria-label="판매 상태">
            <option value="">전체 상태</option>
            {Object.entries(MENU_STATUS).map(([value, s]) => (
              <option key={value} value={value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="m3-text-field field:outlined field-label:none toolbar-grow">
          <input type="search" name="keyword" defaultValue={keyword} placeholder="메뉴 이름 검색 (한글/영문)" aria-label="메뉴 이름" />
        </div>
        <button type="submit" className="m3-btn btn:outlined">
          검색
        </button>
        <Link href="/admin/menus/list" className="m3-btn btn:text">
          초기화
        </Link>
      </form>

      <div className={styles.layout}>
        <section aria-label="메뉴 카드">
          {menus.length === 0 ? (
            <p className={`m3-card card:outlined ${styles.empty}`}>😿 조건에 맞는 메뉴가 없습니다.</p>
          ) : (
            <ul className={styles.grid}>
              {menus.map((m) => (
                <MenuCatalogCard key={m.id} menu={m} categoryName={getCategory(m.categoryId)?.name ?? "-"} />
              ))}
            </ul>
          )}
          <p className="margin-top:3 font-size:caption color:text-muted">{menus.length}개 표시</p>
        </section>

        <CatDiary menus={getMenus()} />
      </div>
    </>
  );
}
