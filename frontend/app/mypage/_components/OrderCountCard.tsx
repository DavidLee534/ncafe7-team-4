"use client";
// 요약 줄의 "주문 내역" 칸 — 이 브라우저에서 한 모의 주문 수. 누르면 아래 주문 내역으로 내려간다.
import { useOrders } from "@/lib/orders";

export default function OrderCountCard() {
  const orders = useOrders();

  return (
    <article>
      <small>주문 내역</small>
      <strong>{orders === null ? "—" : `${orders.length}건`}</strong>
      <p>
        <a href="#orders">모의 결제 내역 보기 ↓</a>
      </p>
    </article>
  );
}
