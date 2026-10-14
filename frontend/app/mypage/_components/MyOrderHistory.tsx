"use client";
// 주문 · 모의 결제 내역 — 이 브라우저에 저장된 주문을 최근 순으로 보여주고, 영수증으로 이어 준다.
import Link from "next/link";
import { won } from "@/lib/format";
import { PAY_METHODS, PICKUP_TYPES, useOrders } from "@/lib/orders";
import styles from "./MyOrderHistory.module.css";

export default function MyOrderHistory() {
  const orders = useOrders();

  return (
    <section id="orders" className={styles.history} aria-labelledby="orders-title">
      <div className={styles.heading}>
        <span>ORDER LEDGER</span>
        <h2 id="orders-title">주문 · 모의 결제 내역</h2>
        <p>이 브라우저에서 결제한 모의 주문이에요. 다른 기기에서는 보이지 않아요.</p>
      </div>

      {/* 서버에서 그릴 때는 주문을 몰라서(null) 비워 두고, 브라우저에서 읽은 뒤 그린다 */}
      {orders === null ? null : orders.length === 0 ? (
        <div className={styles.empty}>
          <p>아직 주문한 포션이 없어요.</p>
          <Link href="/menu/alchemy/material">🪄 첫 포션 조합하러 가기</Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {orders.map((order) => (
            <li key={order.id} className={styles.order}>
              <div className={styles.top}>
                <b>{order.id}</b>
                <small>{order.paidAt}</small>
                <i>결제 완료 · 모의</i>
              </div>
              <h3>
                {order.items[0]?.name}
                {order.items.length > 1 && <span> 외 {order.items.length - 1}건</span>}
              </h3>
              <p className={styles.meta}>
                {order.count}잔 · {PICKUP_TYPES[order.pickupType]} · {PAY_METHODS[order.payMethod]}
                {order.payDetail ? ` · ${order.payDetail}` : ""}
              </p>
              <div className={styles.bottom}>
                <strong>{won(order.total)}</strong>
                <Link href={`/checkout/complete?order=${order.id}`}>영수증 보기 →</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
