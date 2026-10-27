"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/_components/AuthContext";
import {
  addServerCartItem,
  clearCart,
  refreshCart,
  removeFromCart,
  setQuantity,
  useCartState,
  MAX_QUANTITY,
} from "@/lib/cart";
import { checkoutApi, type CatalogEntry } from "@/lib/checkoutApi";
import { won } from "@/lib/format";
import styles from "./Shopping.module.css";

export default function ServerCartView() {
  const { data, error: loadError, status } = useCartState();
  const { member, ready } = useAuth();
  const identity = member?.email ?? "";
  const [catalogState, setCatalogState] = useState<{
    identity: string;
    items: CatalogEntry[];
    error: string;
  } | null>(null);
  const catalog = catalogState?.identity === identity ? catalogState.items : [];
  const catalogError =
    catalogState?.identity === identity ? catalogState.error : "";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!ready) return;
    let active = true;
    checkoutApi<CatalogEntry[]>("/my/cart/catalog")
      .then((items) => {
        if (active) setCatalogState({ identity, items, error: "" });
      })
      .catch((cause: Error) => {
        if (active)
          setCatalogState({ identity, items: [], error: cause.message });
      });
    return () => {
      active = false;
    };
  }, [identity, ready]);
  async function change(action: () => Promise<unknown>, message: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "변경하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span>MOKA&apos;S POTION BASKET</span>
        <h1>나의 포션 바구니</h1>
        <p>담은 메뉴와 내 레시피를 확인하고 주문해 보세요.</p>
      </header>
      {(loadError || error) && (
        <div className={styles.notice} role="alert">
          {error || loadError}
          {status === 401 ? (
            <Link href="/login">로그인하기</Link>
          ) : (
            <button type="button" onClick={() => void refreshCart()}>
              다시 불러오기
            </button>
          )}
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {!data && !loadError && <p role="status">장바구니를 불러오는 중…</p>}
      {data && (
        <div className={styles.layout}>
          <section className={styles.card} aria-labelledby="cart-title">
            <div className={styles.heading}>
              <h2 id="cart-title">담은 포션 {data.items.length}종</h2>
              <button
                type="button"
                disabled={busy || !data.items.length}
                onClick={() => {
                  if (window.confirm("장바구니를 모두 비울까요?"))
                    void change(clearCart, "장바구니를 비웠어요.");
                }}
              >
                전체 비우기
              </button>
            </div>
            {!data.items.length ? (
              <p>
                바구니가 비어 있어요. 아래에서 메뉴나 저장한 레시피를 담아
                주세요.
              </p>
            ) : (
              <ul className={styles.items}>
                {data.items.map((item) => (
                  <li key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      {!!item.options.length && (
                        <p>{item.options.join(" · ")}</p>
                      )}
                      <small>{won(item.unitPrice)} / 잔</small>
                      {!item.available && (
                        <p className={styles.error}>
                          현재 판매하지 않는 상품이에요. 주문하려면 빼 주세요.
                        </p>
                      )}
                    </div>
                    <div
                      className={styles.quantity}
                      role="group"
                      aria-label={`${item.name} 수량`}
                    >
                      <button
                        type="button"
                        disabled={busy || item.quantity <= 1}
                        aria-label={`${item.name} 하나 빼기`}
                        onClick={() =>
                          void change(
                            () =>
                              setQuantity(String(item.id), item.quantity - 1),
                            "수량을 바꿨어요.",
                          )
                        }
                      >
                        −
                      </button>
                      <output aria-live="polite">{item.quantity}</output>
                      <button
                        type="button"
                        disabled={busy || item.quantity >= MAX_QUANTITY}
                        aria-label={`${item.name} 하나 더하기`}
                        onClick={() =>
                          void change(
                            () =>
                              setQuantity(String(item.id), item.quantity + 1),
                            "수량을 바꿨어요.",
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <strong>{won(item.lineTotal)}</strong>
                    <button
                      type="button"
                      disabled={busy}
                      aria-label={`${item.name} 삭제`}
                      onClick={() =>
                        void change(
                          () => removeFromCart(String(item.id)),
                          "상품을 뺐어요.",
                        )
                      }
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <aside className={styles.card}>
            <h2>주문 금액</h2>
            <p>총 {data.totalQuantity}잔</p>
            <strong className={styles.total}>{won(data.totalPrice)}</strong>
            {data.items.length > 0 &&
            data.items.every((item) => item.available) &&
            !busy &&
            !loadError ? (
              <Link className={styles.primary} href="/orders/new">
                주문·모의 결제하기
              </Link>
            ) : (
              <button className={styles.primary} disabled>
                주문·모의 결제하기
              </button>
            )}
          </aside>
        </div>
      )}
      <section className={styles.card} aria-labelledby="catalog-title">
        <h2 id="catalog-title">메뉴와 내 레시피 더 담기</h2>
        <p>현재 판매 중인 메뉴와 저장한 내 레시피예요.</p>
        {catalogError && <p role="alert">{catalogError}</p>}
        <div className={styles.catalog}>
          {catalog.map((item) => (
            <article
              key={
                item.menuId ? `menu-${item.menuId}` : `recipe-${item.recipeId}`
              }
            >
              <small>{item.recipeId ? "내 레시피" : "기본 메뉴"}</small>
              <h3>{item.name}</h3>
              <p>{won(item.unitPrice)}</p>
              <button
                type="button"
                disabled={busy || !!loadError}
                onClick={() =>
                  void change(
                    () =>
                      addServerCartItem({
                        menuId: item.menuId,
                        recipeId: item.recipeId,
                      }),
                    "바구니에 담았어요.",
                  )
                }
              >
                담기
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
