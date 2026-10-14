"use client";

import Link from "next/link";
import { useState } from "react";
import { cartCount, cartTotal, clearCart, removeFromCart, setCartQuantity, useCart } from "@/lib/cart";
import { won } from "@/lib/format";
import UserHeader from "../../_components/UserHeader";
import styles from "./Cart.module.css";

const pickupTimes = ["지금 바로 (약 10분)", "20분 뒤", "30분 뒤", "1시간 뒤"];

const orderNumber = () => `NYAN-${String(Date.now()).slice(-6)}`;

type PlacedOrder = { number: string; count: number; total: number; pickup: string; memo: string };

export default function CartPage() {
  const items = useCart();
  const [pickup, setPickup] = useState(pickupTimes[0]);
  const [memo, setMemo] = useState("");
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const count = cartCount(items);
  const total = cartTotal(items);

  // 백엔드 주문 API 가 생기면 여기서 orders / order_item 을 저장한다. 지금은 모의 주문.
  const placeOrder = () => {
    setPlaced({ number: orderNumber(), count, total, pickup, memo: memo.trim() });
    clearCart();
    setMemo("");
  };

  if (placed) {
    return <><UserHeader /><main className={styles.page}>
      <section className={styles.done} aria-live="polite">
        <span className={styles.owl} aria-hidden="true">🦉</span>
        <small>ORDER RECEIVED · 모의 주문</small>
        <h1>주문서를 모카 점장에게<br /><em>전달했어요!</em></h1>
        <p>주문번호 <b>{placed.number}</b> · 포션 {placed.count}개 · {won(placed.total)}</p>
        <p>픽업 시간: {placed.pickup}. 카운터에서 주문번호를 말해 주세요부엉.</p>
        {placed.memo && <p>요청 사항: {placed.memo}</p>}
        <div className={styles.doneActions}><Link href="/menu/alchemy">🪄 포션 더 만들기</Link><Link href="/menu">메뉴 책장 보기</Link></div>
      </section>
    </main></>;
  }

  return <><UserHeader /><main className={styles.page}>
    <header className={styles.hero}>
      <span>OWL CLERK&apos;S COUNTER</span>
      <h1>부엉이 점원의<br /><em>포션 바구니</em></h1>
      <p>공방에서 담은 포션과 메뉴를 확인하고 매장 픽업으로 주문해요. 수량을 바꾸거나 빼고 싶은 포션은 여기서 정리할 수 있어요.</p>
      <b aria-hidden="true">🦉</b>
    </header>

    {items.length === 0 ? (
      <section className={styles.empty}>
        <span aria-hidden="true">🧺</span>
        <h2>바구니가 아직 비어 있어요</h2>
        <p>연금 공방에서 포션을 조합하거나 감정 연금술로 처방을 받아 담아 보세요부엉.</p>
        <div><Link href="/menu/alchemy/material">재료 연금술</Link><Link href="/menu/alchemy">감정 연금술</Link><Link href="/menu">메뉴 책장</Link></div>
      </section>
    ) : (
      <div className={styles.layout}>
        <section className={styles.list} aria-label="장바구니에 담긴 포션">
          <div className={styles.listHead}><h2>담은 포션 <b>{count}</b></h2><button type="button" onClick={clearCart}>전체 비우기</button></div>
          <ul>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <span className={styles.icon} aria-hidden="true">{item.icon}</span>
                <div className={styles.info}><b>{item.name}</b><small>{item.detail}</small><em>{won(item.price)}</em></div>
                <div className={styles.quantity} aria-label={`${item.name} 수량`}>
                  <button type="button" onClick={() => setCartQuantity(item.id, item.quantity - 1)} aria-label="하나 빼기">−</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => setCartQuantity(item.id, item.quantity + 1)} aria-label="하나 더하기" disabled={item.quantity >= 99}>+</button>
                </div>
                <strong className={styles.lineTotal}>{won(item.price * item.quantity)}</strong>
                <button type="button" className={styles.remove} onClick={() => removeFromCart(item.id)} aria-label={`${item.name} 빼기`}>×</button>
              </li>
            ))}
          </ul>
        </section>

        <aside className={styles.summary}>
          <h2>주문서</h2>
          <div className={styles.speech}><b>🦉 부엉이 점원</b><p>“포션 {count}개, 잘 챙겨 두었어요. 언제 찾으러 오실 건가요부엉?”</p></div>
          <label className={styles.field}>픽업 시간
            <select value={pickup} onChange={(event) => setPickup(event.target.value)}>{pickupTimes.map((time) => <option key={time}>{time}</option>)}</select>
          </label>
          <label className={styles.field}>요청 사항 <small>선택</small>
            <textarea value={memo} onChange={(event) => setMemo(event.target.value)} maxLength={100} rows={3} placeholder="예: 얼음 적게, 포장해 주세요" />
          </label>
          <dl className={styles.totals}>
            <div><dt>상품 금액</dt><dd>{won(total)}</dd></div>
            <div><dt>픽업 할인</dt><dd>0원</dd></div>
            <div className={styles.grand}><dt>결제 예정 금액</dt><dd>{won(total)}</dd></div>
          </dl>
          <button type="button" className={styles.order} onClick={placeOrder}>매장 픽업 주문하기</button>
          <p className={styles.notice}>지금은 모의 결제예요. 실제 결제는 이루어지지 않아요.</p>
        </aside>
      </div>
    )}
  </main></>;
}
