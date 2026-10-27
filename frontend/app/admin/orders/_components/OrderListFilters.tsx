// 주문 목록 조작 패널 — 제목 · 상태 칩 · 검색 폼(주문번호·픽업 이름, 정렬).
// 상태 칩은 ?status= 로 이동하고, 검색 폼은 GET 이라 조건이 주소의 쿼리로 남는다.
// 고른 상태는 숨은 값으로 함께 보내서 검색해도 유지되고, 칩을 눌러도 검색어·정렬은 유지된다.
import Link from "next/link";
import { ORDER_STATUS } from "@/lib/format";
import type { OrderStatus, OrderSummary } from "@/lib/types";
import styles from "../../_components/AdminList.module.css";

type Props = {
  summary: OrderSummary;
  status: string;
  keyword: string;
  sort: string;
  orderCount: number; // 조건에 맞는 주문 수
};

export default function OrderListFilters({ summary, status, keyword, sort, orderCount }: Props) {
  const href = (nextStatus: string) => {
    const query = new URLSearchParams();
    if (nextStatus) query.set("status", nextStatus);
    if (keyword) query.set("keyword", keyword);
    if (sort) query.set("sort", sort);
    return query.size > 0 ? `/admin/orders?${query}` : "/admin/orders";
  };
  const chipClass = (active: boolean) => `${styles.chip} ${active ? styles.chipActive : ""}`;

  return (
    <section className={styles.panel} aria-labelledby="order-list-title">
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>MIDNIGHT ORDERS</span>
          <h2 id="order-list-title">주문 목록</h2>
        </div>
        <p>
          <strong>{orderCount}</strong>건의 주문이 선택한 조건에 맞습니다.
        </p>
      </div>

      <nav className={styles.rail} aria-label="주문 상태 빠른 필터">
        <Link href={href("")} className={chipClass(!status)}>
          전체 <span>{summary.all}</span>
        </Link>
        {(Object.keys(ORDER_STATUS) as OrderStatus[]).map((value) => (
          <Link key={value} href={href(value)} className={chipClass(status === value)}>
            {ORDER_STATUS[value].label} <span>{summary[value]}</span>
          </Link>
        ))}
      </nav>

      <form className={styles.filterBar} role="search" aria-label="주문 검색">
        <label className={styles.searchField}>
          <i className="m3-icon icon:search" aria-hidden="true" />
          <input type="search" name="keyword" defaultValue={keyword} placeholder="주문번호 또는 픽업 이름으로 검색" />
        </label>
        <label className={styles.selectField}>
          <span className="sr-only">정렬</span>
          <select name="sort" defaultValue={sort} aria-label="정렬">
            <option value="">최근 주문부터</option>
            <option value="oldest">오래된 주문부터</option>
          </select>
        </label>
        {status && <input type="hidden" name="status" value={status} />}
        <button type="submit" className="m3-btn btn:outlined">
          적용
        </button>
        {(status || keyword || sort) && (
          <Link href="/admin/orders" className={styles.resetLink}>
            필터 초기화
          </Link>
        )}
      </form>
    </section>
  );
}
