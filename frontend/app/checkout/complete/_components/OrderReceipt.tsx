"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MemberGate from "@/app/potion-showcases/_components/MemberGate";
import { memberApi, type MyOrderDetail } from "@/lib/memberApi";
import { won } from "@/lib/format";
import styles from "../../_components/Checkout.module.css";

export default function OrderReceipt({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<MyOrderDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!/^\d+$/.test(orderId)) return;
    memberApi<MyOrderDetail>(`/my/orders/${orderId}`)
      .then(setOrder)
      .catch(cause => setError((cause as Error).message));
  }, [orderId]);

  return <MemberGate><main className={styles.page}>
    {!/^\d+$/.test(orderId) || error ? <section className={styles.notice}>
      <h2>주문을 찾을 수 없어요</h2><p>{error || "주문번호를 확인해 주세요."}</p><Link href="/my/orders">주문 내역 보기</Link>
    </section> : !order ? <section className={styles.notice}><p>주문을 불러오는 중…</p></section> :
      <section className={styles.receipt} aria-labelledby="receipt-title">
        <span className={styles.stamp} aria-hidden="true">🐾</span>
        <h1 id="receipt-title">주문이 접수됐어요!</h1>
        <p className={styles.call}>포션이 준비되면 <b>‘{order.pickupName}’</b> 님을 불러 드릴게요.</p>
        <dl className={styles.info}>
          <div><dt>주문번호</dt><dd>{order.orderNumber}</dd></div>
          <div><dt>주문 상태</dt><dd>{order.status === "ordered" ? "접수 완료" : order.status}</dd></div>
          <div><dt>받는 방법</dt><dd>{order.pickupType === "takeout" ? "포장" : "매장"}</dd></div>
          {order.request && <div><dt>요청사항</dt><dd>{order.request}</dd></div>}
        </dl>
        <ul className={styles.items}>{order.items.map((item, index) => <li key={index}>
          <div><b>{item.name}</b><small>{item.options}</small></div><span>{item.quantity}개</span><strong>{won(item.lineTotal)}</strong>
        </li>)}</ul>
        <dl className={styles.amount}><div className={styles.total}><dt>현장 결제 예정 금액</dt><dd>{won(order.totalPrice)}</dd></div></dl>
        <div className={styles.actions}><Link href="/my/orders">주문 내역 보기</Link><Link href="/menu">메뉴 더 보기</Link></div>
      </section>}
  </main></MemberGate>;
}
