import Link from "next/link";
import { MENU_STATUS } from "@/lib/format";
import { getMenus } from "@/lib/mock";
import type { Category } from "@/lib/types";
import styles from "./MenuCatalog.module.css";

type Counts = { all: number };

type Props = {
  categories: Category[];
  counts: Counts;
  category: string;
  status: string;
  keyword: string;
  menuCount: number;
};

export default function MenuCatalogFilters({
  categories,
  counts,
  category,
  status,
  keyword,
  menuCount,
}: Props) {
  return (
    <section className={styles.controlPanel} aria-labelledby="catalog-title">
      <div className={styles.panelHeading}>
        <div>
          <span className={styles.eyebrow}>PAW-APPROVED CATALOG</span>
          <h2 id="catalog-title">모카가 고른 메뉴</h2>
        </div>
        <p>
          <strong>{menuCount}</strong>개의 메뉴가 선택한 조건에 맞습니다.
        </p>
      </div>

      <div className={styles.signatureShelf} aria-label="시그니처 메뉴 안내">
        <div className={styles.signatureTitle}>
          <span aria-hidden="true">🪄</span>
          <div>
            <b>비밀 레시피 보관함</b>
            <small>밤의 공방에서만 구울 수 있어요</small>
          </div>
        </div>
        <div className={styles.signatureMenu}>
          <span aria-hidden="true">🧃</span>
          <div>
            <b>츄르 에이드</b>
            <small>반짝이는 과일 젤리와 탄산의 마법</small>
          </div>
        </div>
        <div className={styles.signatureMenu}>
          <span aria-hidden="true">🐟</span>
          <div>
            <b>생선 구이 맛 쿠키</b>
            <small>사실은 달콤한 붕어빵 맛 디저트</small>
          </div>
        </div>
      </div>

      <nav className={styles.categoryRail} aria-label="카테고리 빠른 필터">
        <Link
          href="/admin/menus/list"
          className={`${styles.categoryChip} ${!category ? styles.categoryChipActive : ""}`}
        >
          전체 <span>{counts.all}</span>
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/admin/menus/list?category=${item.id}`}
            className={`${styles.categoryChip} ${String(item.id) === category ? styles.categoryChipActive : ""}`}
          >
            {item.name} <span>{getMenus({ categoryId: item.id }).length}</span>
          </Link>
        ))}
      </nav>

      <form
        className={styles.filterBar}
        role="search"
        aria-label="메뉴 검색 및 필터"
      >
        <label className={styles.searchField}>
          <i className="m3-icon icon:search" aria-hidden="true" />
          <input
            type="search"
            name="keyword"
            defaultValue={keyword}
            placeholder="메뉴명으로 검색"
          />
        </label>
        <label className={styles.selectField}>
          <span className="sr-only">판매 상태</span>
          <select name="status" defaultValue={status} aria-label="판매 상태">
            <option value="">전체 상태</option>
            {Object.entries(MENU_STATUS).map(([value, item]) => (
              <option key={value} value={value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {category && <input type="hidden" name="category" value={category} />}
        <button type="submit" className="m3-btn btn:outlined">
          적용
        </button>
        {(category || status || keyword) && (
          <Link href="/admin/menus/list" className={styles.resetLink}>
            필터 초기화
          </Link>
        )}
      </form>
    </section>
  );
}
