import Link from "next/link";
import { won } from "@/lib/format";
import styles from "./Cart.module.css";

type Props = {
  count: number; // 담은 잔 수
  total: number;
};

// 오른쪽 결제 요약 — 잔 수 · 합계 · 주문하기(모의 결제 페이지로)
export default function CartSummary({ count, total }: Props) {
  return (
    <aside className={styles.summary} aria-label="주문 요약">
      <h2>주문 요약</h2>
      <dl>
        <div>
          <dt>담은 포션</dt>
          <dd>{count}잔</dd>
        </div>
        <div className={styles.total}>
          <dt>합계</dt>
          <dd>{won(total)}</dd>
        </div>
      </dl>
      <Link href="/checkout" className={styles.order}>
        주문하기
      </Link>
      <Link href="/menu/alchemy/material" className={styles.more}>
        🪄 포션 더 조합하기
      </Link>
      <p>실제 주문 전 알레르기 정보를 확인해 주세요.</p>
    </aside>
  );
}
