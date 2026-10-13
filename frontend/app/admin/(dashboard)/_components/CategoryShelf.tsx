// 카테고리별 메뉴 — 정렬 순서대로 메뉴 수를 막대로 보여준다. 이름을 누르면 그 카테고리 메뉴 목록으로 간다.
import Link from "next/link";
import type { Category } from "@/lib/types";
import DetailCard from "../../_components/DetailCard";
import styles from "./Dashboard.module.css";

export type ShelfRow = { category: Category; count: number };

export default function CategoryShelf({ rows }: { rows: ShelfRow[] }) {
  const max = Math.max(1, ...rows.map((row) => row.count));

  return (
    <DetailCard id="shelf" title="🧺 카테고리별 메뉴">
      <ul className={styles.shelf}>
        {rows.map(({ category, count }) => (
          <li key={category.id}>
            <Link href={`/admin/menus?category=${category.id}`} className={styles.shelfName}>
              {category.name}
              {!category.visible && <span className="m3-badge badge:inline badge-color:neutral margin-left:2">숨김</span>}
            </Link>
            <span className={styles.bar} aria-hidden="true">
              <span style={{ width: `${(count / max) * 100}%` }} />
            </span>
            <span className={styles.count}>{count}개</span>
          </li>
        ))}
      </ul>
    </DetailCard>
  );
}
