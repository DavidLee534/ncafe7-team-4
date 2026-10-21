import Link from "next/link";
import { MENU_STATUS } from "@/lib/format";
import styles from "./MenuList.module.css";

type Props = {
  category: string;
  status: string;
  keyword: string;
};

// 메뉴 이름 검색 · 판매 상태 필터. GET 폼이라 조건이 주소의 쿼리로 남는다.
// 고른 카테고리는 숨은 값으로 함께 보내서 검색해도 유지된다.
export default function MenuListSearch({ category, status, keyword }: Props) {
  return (
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
        <Link href="/admin/menus" className={styles.resetLink}>
          필터 초기화
        </Link>
      )}
    </form>
  );
}
