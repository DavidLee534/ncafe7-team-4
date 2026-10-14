"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import styles from "../MenuDetail.module.css";

// 수량을 고르고 장바구니에 담거나, 이 메뉴를 바탕으로 재료 연금술에서 조합하는 칸
export default function MenuOrderBox({ menuId, name, base, icon, price }: { menuId: number; name: string; base: string; icon: string; price: number }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const putInCart = () => { addToCart({ name, detail: base, icon, price }, quantity); setAdded(true); };

  return <div className={styles.order}>
    <div className={styles.orderRow}>
      <div className={styles.quantity} aria-label="수량">
        <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="하나 빼기">−</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((value) => Math.min(99, value + 1))} disabled={quantity >= 99} aria-label="하나 더하기">+</button>
      </div>
      <div className={styles.priceBox}><small className={styles.notice}>기반 재료만 쓴 기본 가격이에요.</small><strong className={styles.price}>{(price * quantity).toLocaleString()}원</strong></div>
    </div>
    <div className={styles.actions}>
      <button type="button" className={styles.addCart} onClick={putInCart}>🛒 장바구니에 담기</button>
      <Link href={`/menu/alchemy?menu=${menuId}`} className={styles.combine} aria-describedby="combine-tip">🪄 조합하기<span id="combine-tip" role="tooltip" className={styles.tooltip}>이 물약을 기반으로 직접 조합하러 가기</span></Link>
    </div>
    {added && <p className={styles.added} role="status">담았어요! <Link href="/cart">장바구니 보기 →</Link></p>}
  </div>;
}
