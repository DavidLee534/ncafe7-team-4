import Link from "next/link";
import styles from "./MenuList.module.css";

// 검색 · 필터 결과가 없을 때 안내
export default function MenuListEmpty() {
  return (
    <div className={styles.empty}>
      <span aria-hidden="true">☕</span>
      <h3>조건에 맞는 메뉴가 없어요.</h3>
      <p>검색어나 필터를 바꿔 보거나, 새 메뉴를 등록해 보세요.</p>
      <Link href="/admin/menus">전체 메뉴 보기</Link>
    </div>
  );
}
