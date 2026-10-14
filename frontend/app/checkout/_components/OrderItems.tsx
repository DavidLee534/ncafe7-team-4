import type { CartItem } from "@/lib/cart";
import { won } from "@/lib/format";
import styles from "./Checkout.module.css";

// 주문 포션 목록 — 결제 화면과 영수증에서 같이 쓴다
export default function OrderItems({ items }: { items: CartItem[] }) {
  return (
    <ul className={styles.items}>
      {items.map((item) => (
        <li key={item.key}>
          <div>
            <b>{item.name}</b>
            <small>{item.options.join(" · ")}</small>
          </div>
          <span>× {item.quantity}</span>
          <strong>{won(item.unitPrice * item.quantity)}</strong>
        </li>
      ))}
    </ul>
  );
}
