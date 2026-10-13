import type { Category } from "@/lib/types";
import CategoryRail from "./CategoryRail";
import MenuSearchForm from "./MenuSearchForm";
import SignatureShelf from "./SignatureShelf";
import styles from "./MenuCatalog.module.css";

type Props = {
  categories: Category[];
  totalCount: number;
  menuCounts: Record<number, number>;
  category: string;
  status: string;
  keyword: string;
  menuCount: number; // 조건에 맞는 메뉴 수
};

// 메뉴 카탈로그 조작 패널 — 제목 · 시그니처 안내 · 카테고리 칩 · 검색 폼을 묶는다.
export default function MenuCatalogFilters({
  categories,
  totalCount,
  menuCounts,
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

      <SignatureShelf />
      <CategoryRail
        categories={categories}
        totalCount={totalCount}
        menuCounts={menuCounts}
        category={category}
      />
      <MenuSearchForm category={category} status={status} keyword={keyword} />
    </section>
  );
}
