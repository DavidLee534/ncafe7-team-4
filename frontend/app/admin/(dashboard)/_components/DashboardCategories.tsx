// 카테고리별 메뉴 — 정렬 순서대로 메뉴 수를 막대로 보여준다. 이름을 누르면 그 카테고리 메뉴 목록으로 간다.
import Link from "next/link";
import type { MenuCategory } from "@/lib/types";
import DetailCard from "../../_components/DetailCard";
import styles from "./Dashboard.module.css";

export default function DashboardCategories({ categories }: { categories: MenuCategory[] }) {
  const max = Math.max(1, ...categories.map((category) => category.menuCount));

  return (
    <DetailCard id="shelf" title="🧺 카테고리별 메뉴">
      <ul className={styles.shelf}>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/admin/menus?category=${category.id}`} className={styles.shelfName}>
              {category.name}
            </Link>
            <span className={styles.bar} aria-hidden="true">
              <span style={{ width: `${(category.menuCount / max) * 100}%` }} />
            </span>
            <span className={styles.count}>{category.menuCount}개</span>
          </li>
        ))}
      </ul>
    </DetailCard>
  );
}
