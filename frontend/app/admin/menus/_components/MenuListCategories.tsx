import Link from "next/link";
import type { MenuCategory } from "@/lib/types";
import styles from "./MenuList.module.css";

type Props = {
  categories: MenuCategory[]; // 카테고리별 메뉴 수(menuCount) 포함
  totalCount: number;
  category: string; // 선택된 카테고리 id (없으면 "")
};

// 카테고리 빠른 필터 — 칩을 누르면 ?category=id 로 이동한다.
export default function MenuListCategories({
  categories,
  totalCount,
  category,
}: Props) {
  const chipClass = (active: boolean) =>
    `${styles.categoryChip} ${active ? styles.categoryChipActive : ""}`;

  return (
    <nav className={styles.categoryRail} aria-label="카테고리 빠른 필터">
      <Link href="/admin/menus" className={chipClass(!category)}>
        전체 <span>{totalCount}</span>
      </Link>
      {categories.map((item) => (
        <Link
          key={item.id}
          href={`/admin/menus?category=${item.id}`}
          className={chipClass(String(item.id) === category)}
        >
          {item.name} <span>{item.menuCount}</span>
        </Link>
      ))}
    </nav>
  );
}
