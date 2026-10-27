"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { checkoutApi, type Receipt } from "@/lib/checkoutApi";
import { won } from "@/lib/format";
import styles from "../../../my/cart/Shopping.module.css";

const methods: Record<string, string> = {
  card: "신용·체크카드",
  easy: "간편결제",
  transfer: "계좌이체",
};
export default function ServerReceipt({ id }: { id: string }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    checkoutApi<Receipt>(`/orders/${encodeURIComponent(id)}/receipt`)
      .then((value) => {
        if (active) setReceipt(value);
      })
      .catch((cause: Error) => {
        if (active) setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  return (
    <main className={styles.page}>
      <section className={`${styles.card} ${styles.receipt}`}>
        {error ? (
          <p role="alert">{error}</p>
        ) : !receipt ? (
          <p role="status">영수증을 불러오는 중…</p>
        ) : (
          <>
            <p>MOCK PAYMENT · 실제로 결제되지 않았어요</p>
            <h1>결제가 끝났어요!</h1>
            <p>
              준비되면 <b>{receipt.pickupName}</b> 님을 불러 드릴게요.
            </p>
            <dl>
              <div>
                <dt>주문번호</dt>
                <dd>{receipt.orderNumber}</dd>
              </div>
              <div>
                <dt>결제 시각</dt>
                <dd>{receipt.payment.paidAt.replace("T", " ").slice(0, 19)}</dd>
              </div>
              <div>
                <dt>결제 수단</dt>
                <dd>{methods[receipt.payment.method]} (모의)</dd>
              </div>
              <div>
                <dt>승인번호</dt>
                <dd>{receipt.payment.approvalCode}</dd>
              </div>
              <div>
                <dt>받는 방법</dt>
                <dd>{receipt.pickupType === "takeout" ? "포장" : "매장"}</dd>
              </div>
              {receipt.request && (
                <div>
                  <dt>요청사항</dt>
                  <dd>{receipt.request}</dd>
                </div>
              )}
            </dl>
            {receipt.items.map((item, index) => (
              <div key={index} className={styles.summary}>
                <span>
                  {item.name} × {item.quantity}
                  <small>{item.options && ` · ${item.options}`}</small>
                </span>
                <strong>{won(item.lineTotal)}</strong>
              </div>
            ))}
            <strong className={styles.total}>
              결제 금액 {won(receipt.totalPrice)}
            </strong>
          </>
        )}
        <div className={styles.actions}>
          <Link href="/my/cart">장바구니로</Link>
          <Link href="/menu">메뉴 더 보기</Link>
        </div>
      </section>
    </main>
  );
}
