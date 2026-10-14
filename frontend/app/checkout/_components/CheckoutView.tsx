"use client";
// 주문 · 모의 결제 화면 — 입력값을 확인하면 모의 결제창(PaymentPopup)을 띄우고,
// 결제창에서 승인이 나면 주문을 저장한 뒤 영수증 화면으로 보낸다.
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { won } from "@/lib/format";
import { placeOrder, type OrderInfo, type PayMethod, type PickupType } from "@/lib/orders";
import CheckoutForm from "./CheckoutForm";
import OrderItems from "./OrderItems";
import PaymentPopup from "./PaymentPopup";
import styles from "./Checkout.module.css";

export default function CheckoutView() {
  const cart = useCart();
  const router = useRouter();
  // 결제창을 띄운 동안의 주문 정보. null 이면 결제창이 닫혀 있다
  const [pending, setPending] = useState<Omit<OrderInfo, "payDetail"> | null>(null);
  const [cancelled, setCancelled] = useState(false);
  // 승인 뒤에는 장바구니가 비워져도 "영수증으로 이동" 화면을 유지한다
  const [paid, setPaid] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart || cart.length === 0) return;
    const form = new FormData(e.currentTarget);
    setCancelled(false);
    setPending({
      pickupName: String(form.get("pickupName")).trim(),
      pickupType: form.get("pickupType") as PickupType,
      payMethod: form.get("payMethod") as PayMethod,
      request: String(form.get("request") ?? "").trim(),
    });
  }

  function handleApproved(payDetail: string) {
    if (!cart || !pending) return;
    const order = placeOrder(cart, { ...pending, payDetail });
    setPaid(true);
    router.replace(`/checkout/complete?order=${order.id}`);
  }

  function handleCancel() {
    setPending(null);
    setCancelled(true);
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span>MOCK PAYMENT · 모의 결제</span>
        <h1>
          포션 값을
          <br />
          <em>치러 볼까요?</em>
        </h1>
        <p>연습용 결제예요. 결제창이 뜨지만 카드 번호 같은 결제 정보는 받지 않고, 실제로 돈이 나가지 않아요.</p>
      </header>

      {paid ? (
        <section className={styles.paying} role="status" aria-live="polite">
          <span aria-hidden="true">🔮</span>
          <h2>결제가 끝났어요. 영수증을 펼치는 중…</h2>
        </section>
      ) : cart === null ? null : cart.length === 0 ? (
        <section className={styles.notice}>
          <h2>결제할 포션이 없어요</h2>
          <p>장바구니에 포션을 담은 뒤 다시 와 주세요.</p>
          <Link href="/cart">장바구니로 가기</Link>
        </section>
      ) : (
        <form className={styles.layout} onSubmit={handleSubmit}>
          <CheckoutForm />
          <aside className={styles.side} aria-label="결제 금액">
            <h2>주문 포션</h2>
            <OrderItems items={cart} />
            <dl className={styles.amount}>
              <div>
                <dt>포션 {cartCount(cart)}잔</dt>
                <dd>{won(cartTotal(cart))}</dd>
              </div>
              <div className={styles.total}>
                <dt>결제 금액</dt>
                <dd>{won(cartTotal(cart))}</dd>
              </div>
            </dl>
            {cancelled && (
              <p className={styles.cancelled} role="status">
                결제를 취소했어요. 다시 결제하려면 아래 버튼을 눌러 주세요.
              </p>
            )}
            <button type="submit" className={styles.pay}>
              {won(cartTotal(cart))} 모의 결제하기
            </button>
            <Link href="/cart" className={styles.back}>
              ← 장바구니로 돌아가기
            </Link>
          </aside>
        </form>
      )}

      {pending && cart && cart.length > 0 && !paid && (
        <PaymentPopup
          method={pending.payMethod}
          amount={cartTotal(cart)}
          orderName={cart.length > 1 ? `${cart[0].name} 외 ${cart.length - 1}건` : cart[0].name}
          onCancel={handleCancel}
          onApproved={handleApproved}
        />
      )}
    </main>
  );
}
