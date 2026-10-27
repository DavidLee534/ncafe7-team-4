"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserHeader from "@/app/_components/UserHeader";
import MemberGate from "@/app/potion-showcases/_components/MemberGate";
import { memberApi, dateText, priceText, type MyOrderDetail } from "@/lib/memberApi";
import styles from "../../../My.module.css";

export default function OrderDetailView({ id }: { id: number }) {
  const [order, setOrder] = useState<MyOrderDetail | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { memberApi<MyOrderDetail>(`/my/orders/${id}`).then(setOrder).catch(e => setError(e.message)); }, [id]);
  async function cancel() {
    if (!confirm("이 주문을 취소할까요?")) return;
    try { const next = await memberApi<MyOrderDetail>(`/my/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "cancelled" }) }); setOrder(next); setError(""); }
    catch (e) { setError((e as Error).message); }
  }
  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}><Link href="/my/orders" className={styles.back}>← 주문 내역</Link><header className={styles.hero}><span className={styles.eyebrow}>ORDER RECEIPT</span><h1>주문 상세</h1></header>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {order && <><section className={styles.panel}><h2>{order.orderNumber}</h2><p>{order.status === "ordered" ? "접수 완료" : order.status} · {dateText(order.createdAt)}</p><p>픽업 이름: {order.pickupName} · {order.pickupType === "takeout" ? "포장" : "매장"}</p>{order.request && <p>요청 사항: {order.request}</p>}{["ordered", "paid"].includes(order.status) && <button type="button" className={styles.secondary} onClick={cancel}>주문 취소</button>}</section>
      <section className={styles.panel}><h2>주문 항목</h2>{order.items.map((item, index) => <div className={styles.row} key={index}><div>{item.name}<br /><small>{item.options}</small></div><span>{item.quantity}개 · {priceText(item.lineTotal)}</span></div>)}<h2>합계 {priceText(order.totalPrice)}</h2></section>
      {order.status === "ordered" && <p className={styles.muted}>결제는 포션을 받을 때 매장에서 진행합니다.</p>}</>}
  </div></main></MemberGate></>;
}
