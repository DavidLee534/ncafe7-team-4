"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserHeader from "@/app/_components/UserHeader";
import MemberGate from "@/app/potion-showcases/_components/MemberGate";
import { memberApi, dateText, priceText, type MyOrder, type OrderSummary } from "@/lib/memberApi";
import styles from "../My.module.css";

const filters = [["", "전체"], ["ordered", "접수 완료"], ["paid", "결제 완료"], ["brewing", "제조 중"], ["ready", "준비 완료"], ["done", "수령 완료"], ["cancelled", "취소"]];

export default function MyOrdersPage() {
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { memberApi<OrderSummary>("/my/orders/summary").then(setSummary).catch(e => setError(e.message)); }, []);
  useEffect(() => { memberApi<MyOrder[]>(`/my/orders${status ? `?status=${status}` : ""}`).then(data => { setOrders(data); setError(""); }).catch(e => setError(e.message)); }, [status]);
  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}><Link href="/my" className={styles.back}>← 마이페이지</Link><header className={styles.hero}><span className={styles.eyebrow}>ORDER LEDGER</span><h1>주문 내역</h1><p className={styles.muted}>주문 상태와 상세 내역을 확인하세요.</p></header>
    {summary && <div className={styles.grid}><div className={styles.card}>전체<strong>{summary.all}</strong></div><div className={styles.card}>진행 중<strong>{summary.inProgress}</strong></div><div className={styles.card}>수령 완료<strong>{summary.done}</strong></div></div>}
    <div className={styles.filter}>{filters.map(([key, label]) => <button key={key} type="button" className={status === key ? styles.active : ""} onClick={() => setStatus(key)}>{label}</button>)}</div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <section className={styles.panel}>{orders.length ? orders.map(order => <div className={styles.row} key={order.id}><div><Link href={`/my/orders/${order.id}`}>{order.itemSummary}</Link><br /><small>{order.orderNumber} · {dateText(order.createdAt)}</small></div><span>{priceText(order.totalPrice)} · {order.status === "ordered" ? "접수 완료" : order.status}</span></div>) : <p className={styles.muted}>해당 주문이 없어요.</p>}</section>
  </div></main></MemberGate></>;
}
