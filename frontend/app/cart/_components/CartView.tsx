"use client";
// 장바구니 화면 — 저장된 장바구니를 읽어서 목록 · 합계를 배치한다. 주문하기는 모의 결제 페이지로 이어진다.
import { cartCount, cartTotal, clearCart, useCart } from "@/lib/cart";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import styles from "./Cart.module.css";

export default function CartView() {
  const cart = useCart();

  function handleClear() {
    if (window.confirm("장바구니를 모두 비울까요?")) clearCart();
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span>MOKA&apos;S POTION BASKET</span>
        <h1>
          모카 점장의
          <br />
          <em>포션 바구니</em>
        </h1>
        <p>공방에서 담은 포션을 확인하고 수량을 바꿀 수 있어요. 바구니는 이 브라우저에 보관된답니다냥.</p>
      </header>

      {/* 서버에서 그릴 때는 장바구니를 몰라서(null) 비워 두고, 브라우저에서 읽은 뒤 그린다 */}
      {cart === null ? null : cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className={styles.layout}>
          <section className={styles.list} aria-labelledby="cart-list-title">
            <div className={styles.listHeading}>
              <h2 id="cart-list-title">담은 포션 {cart.length}종</h2>
              <button type="button" onClick={handleClear}>
                전체 비우기
              </button>
            </div>
            <ul>
              {cart.map((item) => (
                <CartItemRow key={item.key} item={item} />
              ))}
            </ul>
          </section>
          <CartSummary count={cartCount(cart)} total={cartTotal(cart)} />
        </div>
      )}
    </main>
  );
}
