import type { Menu, MenuCategory } from "@/lib/types";
import MenuListCategories from "./MenuListCategories";
import MenuListSearch from "./MenuListSearch";
import MenuListRecommended from "./MenuListRecommended";
import styles from "./MenuList.module.css";

type Props = {
  categories: MenuCategory[];
  totalCount: number;
  category: string;
  status: string;
  keyword: string;
  menuCount: number; // 조건에 맞는 메뉴 수
  recommendedMenus: Menu[]; // 사장 추천 메뉴
};

// 메뉴 카탈로그 조작 패널 — 제목 · 사장 추천 메뉴 · 카테고리 칩 · 검색 폼을 묶는다.
export default function MenuListFilters({
  categories,
  totalCount,
  category,
  status,
  keyword,
  menuCount,
  recommendedMenus,
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

      <MenuListRecommended menus={recommendedMenus} />
      <MenuListCategories categories={categories} totalCount={totalCount} category={category} />
      <MenuListSearch category={category} status={status} keyword={keyword} />
    </section>
  );
}
