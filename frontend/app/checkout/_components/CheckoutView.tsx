"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MemberGate from "@/app/potion-showcases/_components/MemberGate";
import { useAuth } from "@/app/_components/AuthContext";
import { cartCount, cartTotal, clearCart, useCart } from "@/lib/cart";
import { won } from "@/lib/format";
import { memberApi, type MyOrderDetail } from "@/lib/memberApi";
import CheckoutForm from "./CheckoutForm";
import OrderItems from "./OrderItems";
import styles from "./Checkout.module.css";

export default function CheckoutView() {
  const cart = useCart();
  const { member } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart?.length || submitting) return;
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      const account = await memberApi<{ email: string }>("/my/account");
      if (!member || account.email.toLowerCase() !== member.email.toLowerCase()) {
        throw new Error("현재 로그인 정보와 주문 계정이 일치하지 않습니다. 계정을 확인해 주세요.");
      }
      const order = await memberApi<MyOrderDetail>("/my/orders", {
        method: "POST",
        body: JSON.stringify({
          pickupName: String(form.get("pickupName") ?? "").trim(),
          pickupType: form.get("pickupType"),
          request: String(form.get("request") ?? "").trim(),
          items: cart.map(item => ({
            name: item.name,
            options: item.options.join(", "),
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        }),
      });
      setSubmitted(true);
      clearCart();
      router.replace(`/checkout/complete?order=${order.id}`);
    } catch (cause) {
      setError((cause as Error).message);
      setSubmitting(false);
    }
  }

  return <MemberGate><main className={styles.page}>
    <header className={styles.hero}>
      <span>ORDER YOUR POTION</span>
      <h1>포션을<br /><em>주문할까요?</em></h1>
      <p>주문을 접수하면 마이페이지에서 내역을 확인할 수 있어요. 결제는 포션을 받을 때 매장에서 진행합니다.</p>
    </header>
    {submitted ? <section className={styles.paying} role="status"><h2>주문을 접수했어요. 주문 내역으로 이동합니다…</h2></section>
      : cart === null ? null : cart.length === 0 ? <section className={styles.notice}>
        <h2>주문할 포션이 없어요</h2><p>장바구니에 포션을 담은 뒤 다시 와 주세요.</p><Link href="/cart">장바구니로 가기</Link>
      </section> : <form className={styles.layout} onSubmit={handleSubmit}>
        <CheckoutForm />
        <aside className={styles.side} aria-label="주문 금액">
          <h2>주문 포션</h2>
          <OrderItems items={cart} />
          <dl className={styles.amount}>
            <div><dt>포션 {cartCount(cart)}잔</dt><dd>{won(cartTotal(cart))}</dd></div>
            <div className={styles.total}><dt>현장 결제 예정 금액</dt><dd>{won(cartTotal(cart))}</dd></div>
          </dl>
          {error && <p className={styles.cancelled} role="alert">{error}</p>}
          <button type="submit" className={styles.pay} disabled={submitting}>{submitting ? "접수 중…" : "주문 접수하기"}</button>
          <Link href="/cart" className={styles.back}>← 장바구니로 돌아가기</Link>
        </aside>
      </form>}
  </main></MemberGate>;
}
