"use client";
// 모의 결제 영수증 — 주문번호 · 결제 정보 · 주문 포션. 없는 주문번호면 안내만.
import Link from "next/link";
import { won } from "@/lib/format";
import { PAY_METHODS, PICKUP_TYPES, useOrder } from "@/lib/orders";
import OrderItems from "../../_components/OrderItems";
import styles from "../../_components/Checkout.module.css";

export default function OrderReceipt({ orderId }: { orderId: string }) {
  const order = useOrder(orderId);

  return (
    <main className={styles.page}>
      {order === null ? null : order === undefined ? (
        <section className={styles.notice}>
          <h2>주문을 찾을 수 없어요</h2>
          <p>주문번호를 확인해 주세요. 모의 결제 기록은 결제한 브라우저에만 남아 있어요.</p>
          <Link href="/menu">메뉴 책장으로</Link>
        </section>
      ) : (
        <section className={styles.receipt} aria-labelledby="receipt-title">
          <span className={styles.stamp} aria-hidden="true">
            🐾
          </span>
          <p className={styles.mock}>MOCK PAYMENT · 실제로 결제되지 않았어요</p>
          <h1 id="receipt-title">결제가 끝났어요!</h1>
          <p className={styles.call}>
            포션이 준비되면 <b>&lsquo;{order.pickupName}&rsquo;</b> 님을 불러 드릴게요냥.
          </p>

          <dl className={styles.info}>
            <div>
              <dt>주문번호</dt>
              <dd>{order.id}</dd>
            </div>
            <div>
              <dt>결제 시각</dt>
              <dd>{order.paidAt}</dd>
            </div>
            <div>
              <dt>결제 수단</dt>
              <dd>
                {PAY_METHODS[order.payMethod]}
                {order.payDetail ? ` · ${order.payDetail}` : ""} (모의)
              </dd>
            </div>
            <div>
              <dt>승인번호</dt>
              <dd>{order.approvalCode}</dd>
            </div>
            <div>
              <dt>받는 방법</dt>
              <dd>{PICKUP_TYPES[order.pickupType]}</dd>
            </div>
            {order.request && (
              <div>
                <dt>요청사항</dt>
                <dd>{order.request}</dd>
              </div>
            )}
          </dl>

          <OrderItems items={order.items} />
          <dl className={styles.amount}>
            <div className={styles.total}>
              <dt>결제 금액 · {order.count}잔</dt>
              <dd>{won(order.total)}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <Link href="/menu/alchemy/material">🪄 포션 더 조합하기</Link>
            <Link href="/mypage#orders">주문 내역 보기</Link>
          </div>
        </section>
      )}
    </main>
  );
}
