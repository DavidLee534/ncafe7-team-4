"use client";
import { MAX_QUANTITY, removeFromCart, setQuantity, type CartItem } from "@/lib/cart";
import { won } from "@/lib/format";
import styles from "./Cart.module.css";

// 담은 포션 한 줄 — 이름 · 재료 · 단가, 수량 조절, 줄 합계, 빼기
export default function CartItemRow({ item }: { item: CartItem }) {
  return (
    <li className={styles.item}>
      <span className={styles.itemIcon} aria-hidden="true">
        ⚗️
      </span>
      <div className={styles.itemInfo}>
        <h3>{item.name}</h3>
        <p>{item.options.join(" · ")}</p>
        <small>{won(item.unitPrice)}</small>
      </div>
      <div className={styles.quantity} role="group" aria-label={`${item.name} 수량`}>
        <button type="button" onClick={() => setQuantity(item.key, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="하나 빼기">
          −
        </button>
        <output aria-live="polite">{item.quantity}</output>
        <button
          type="button"
          onClick={() => setQuantity(item.key, item.quantity + 1)}
          disabled={item.quantity >= MAX_QUANTITY}
          aria-label="하나 더하기"
        >
          +
        </button>
      </div>
      <strong className={styles.lineTotal}>{won(item.unitPrice * item.quantity)}</strong>
      <button type="button" className={styles.remove} onClick={() => removeFromCart(item.key)} aria-label={`${item.name} 빼기`}>
        ✕
      </button>
    </li>
  );
}
