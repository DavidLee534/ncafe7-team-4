"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { refreshCart, useCartState } from "@/lib/cart";
import {
  checkoutApi,
  CheckoutApiError,
  type CheckoutBody,
  type Receipt,
} from "@/lib/checkoutApi";
import { won } from "@/lib/format";
import styles from "../../my/cart/Shopping.module.css";

type Attempt = { key: string; body: CheckoutBody };
const ATTEMPT_KEY = "ncafe-pending-checkout-v1";

function savedAttempt(): Attempt | null {
  try {
    const value = sessionStorage.getItem(ATTEMPT_KEY);
    const parsed = value ? (JSON.parse(value) as Attempt) : null;
    return parsed?.key && parsed.body?.cartVersion ? parsed : null;
  } catch {
    return null;
  }
}

export default function ServerCheckoutView() {
  const { data, error: loadError, status } = useCartState();
  const router = useRouter();
  const running = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState("");
  const [uncertain, setUncertain] = useState(false);

  async function send(value: Attempt) {
    if (running.current) return;
    running.current = true;
    setSubmitting(true);
    setError("");
    try {
      // 네트워크 오류·새로고침 뒤에도 같은 키와 같은 본문으로 재시도한다.
      try {
        sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(value));
      } catch {
        /* 메모리의 동일 요청으로 재시도 */
      }
      const receipt = await checkoutApi<Receipt>("/orders", {
        method: "POST",
        headers: { "Idempotency-Key": value.key },
        body: JSON.stringify(value.body),
      });
      try {
        sessionStorage.removeItem(ATTEMPT_KEY);
      } catch {
        /* 저장소 차단 */
      }
      setSubmitted(true);
      void refreshCart();
      router.replace(`/orders/complete/${receipt.id}`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "결제를 처리하지 못했어요.",
      );
      // 응답을 못 받았거나 서버 오류면 성공 여부를 단정하지 않고 같은 요청만 재시도한다.
      const unknown =
        !(cause instanceof CheckoutApiError) || cause.status >= 500;
      setUncertain(unknown);
      if (!unknown) {
        try {
          sessionStorage.removeItem(ATTEMPT_KEY);
        } catch {
          /* 저장소 차단 */
        }
        setAttempt(null);
        await refreshCart();
      }
      setSubmitting(false);
      running.current = false;
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data?.items.length || running.current || uncertain) return;
    const previous = savedAttempt();
    if (previous) {
      setAttempt(previous);
      await send(previous);
      return;
    }
    const form = new FormData(event.currentTarget);
    const value: Attempt = {
      key: crypto.randomUUID(),
      body: {
        pickupName: String(form.get("pickupName") ?? "").trim(),
        pickupType: String(form.get("pickupType")),
        request: String(form.get("request") ?? "").trim(),
        payMethod: String(form.get("payMethod")),
        payDetail: "연습용 모의 결제",
        cartVersion: data.version,
      },
    };
    setAttempt(value);
    await send(value);
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span>MOCK PAYMENT</span>
        <h1>포션 주문·결제</h1>
        <p>
          실제 돈이 나가지 않는 연습용 결제예요. 카드 번호와 비밀번호를 입력하지
          마세요.
        </p>
      </header>
      {(error || loadError) && (
        <div className={styles.notice} role="alert">
          {error || loadError}
          {status === 401 && <Link href="/login">로그인하기</Link>}
          {uncertain && attempt && (
            <>
              <p>
                승인 결과를 확인하지 못했어요. 같은 요청으로 확인하면 중복
                결제되지 않아요.
              </p>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void send(attempt)}
              >
                결제 결과 확인·재시도
              </button>
            </>
          )}
        </div>
      )}
      {submitted ? (
        <p role="status">결제가 끝났어요. 영수증으로 이동합니다…</p>
      ) : !data ? (
        !loadError && <p role="status">주문 정보를 불러오는 중…</p>
      ) : !data.items.length ? (
        <section className={styles.card}>
          <h2>결제할 상품이 없어요</h2>
          <Link href="/my/cart">장바구니로 가기</Link>
          <button
            type="button"
            onClick={() => {
              const pending = savedAttempt();
              if (pending) {
                setAttempt(pending);
                void send(pending);
              } else setError("확인할 결제 요청이 없어요.");
            }}
          >
            이전 결제 결과 확인
          </button>
        </section>
      ) : (
        <form className={styles.layout} onSubmit={submit}>
          <fieldset
            className={styles.card}
            disabled={submitting || uncertain}
            style={{ minWidth: 0 }}
          >
            <legend>주문 정보</legend>
            <div className={styles.fields}>
              <label>
                픽업 이름
                <input
                  name="pickupName"
                  required
                  maxLength={50}
                  autoComplete="nickname"
                  placeholder="포션이 나오면 불러 드릴 이름"
                />
              </label>
              <label>
                받는 방법
                <select name="pickupType">
                  <option value="dine-in">매장에서 마실게요</option>
                  <option value="takeout">포장해 갈게요</option>
                </select>
              </label>
              <label>
                요청사항
                <textarea name="request" maxLength={500} rows={3} />
              </label>
              <label>
                모의 결제 수단
                <select name="payMethod">
                  <option value="card">신용·체크카드</option>
                  <option value="easy">간편결제</option>
                  <option value="transfer">계좌이체</option>
                </select>
              </label>
              <label className={styles.agreement}>
                <input name="agreed" type="checkbox" required />
                <span>
                  주문 상품과 금액을 확인했으며 모의 결제에 동의합니다.
                </span>
              </label>
            </div>
          </fieldset>
          <aside className={styles.card}>
            <h2>주문 포션</h2>
            {data.items.map((item) => (
              <div key={item.id} className={styles.summary}>
                <span>
                  {item.name} × {item.quantity}
                  {!item.available && (
                    <b className={styles.error}> · 판매 중지</b>
                  )}
                </span>
                <strong>{won(item.lineTotal)}</strong>
              </div>
            ))}
            <p>총 {data.totalQuantity}잔</p>
            <strong className={styles.total}>{won(data.totalPrice)}</strong>
            <button
              className={styles.primary}
              type="submit"
              disabled={
                submitting ||
                uncertain ||
                !!loadError ||
                data.items.some((item) => !item.available)
              }
            >
              {submitting ? "결제 확인 중…" : "모의 결제하기"}
            </button>
            <div className={styles.actions}>
              <Link href="/my/cart">장바구니로 돌아가기</Link>
            </div>
          </aside>
        </form>
      )}
    </main>
  );
}
