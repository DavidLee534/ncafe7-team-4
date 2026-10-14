"use client";
// 모의 결제창 — 실제 결제사 결제창처럼 뜨지만 카드 번호 · 비밀번호는 받지 않고, 버튼으로 승인만 흉내 낸다.
// 카드사 · 은행 · 간편결제 이름은 모두 가상이다. 단계: 수단별 선택 → 승인 중 → 완료(또는 실패).
import { useEffect, useRef, useState } from "react";
import { won } from "@/lib/format";
import { PAY_METHODS, type PayMethod } from "@/lib/orders";
import styles from "./PaymentPopup.module.css";

const CARD_COMPANIES = ["달빛카드", "별똥별카드", "고양이카드", "마법사카드", "숲속카드", "구름카드"];
const BANKS = ["별빛은행", "달빛은행", "고양이은행", "숲속은행"];
const EASY_PAY = "냥페이";
const INSTALLMENT_MIN = 50000; // 할부는 5만 원 이상부터

type Step = "select" | "approving" | "done" | "failed";

type Props = {
  method: PayMethod;
  amount: number;
  orderName: string; // 예: "빛과 어둠의 균형 포션 외 1건"
  onCancel: () => void;
  onApproved: (payDetail: string) => void;
};

export default function PaymentPopup({ method, amount, orderName, onCancel, onApproved }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<Step>("select");
  const [card, setCard] = useState(CARD_COMPANIES[0]);
  const [installment, setInstallment] = useState("일시불");
  const [bank, setBank] = useState(BANKS[0]);
  const [agreed, setAgreed] = useState(false);
  const [failTest, setFailTest] = useState(false);

  // 화면에 붙으면 모달로 연다(뒤 화면은 못 누르고, 포커스가 창 안에 머문다)
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const detail =
    method === "card" ? `${card} · ${installment}` : method === "easy" ? EASY_PAY : bank;

  function approve() {
    setStep("approving");
    window.setTimeout(() => {
      if (failTest) {
        setStep("failed");
        return;
      }
      setStep("done");
      window.setTimeout(() => onApproved(detail), 900);
    }, 1500);
  }

  // Esc · 닫기 버튼. 승인 중 · 완료 뒤에는 닫지 않는다
  function cancel() {
    if (step === "approving" || step === "done") return;
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="payment-title"
      onCancel={(e) => {
        e.preventDefault();
        cancel();
      }}
    >
      <header className={styles.bar}>
        <b id="payment-title">🔒 NCafe 모의 결제창</b>
        <button type="button" onClick={cancel} disabled={step === "approving" || step === "done"} aria-label="결제창 닫기">
          ✕
        </button>
      </header>

      <section className={styles.amount}>
        <small>{orderName}</small>
        <strong>{won(amount)}</strong>
        <span>{PAY_METHODS[method]}</span>
      </section>

      {step === "select" && (
        <div className={styles.body}>
          {method === "card" && (
            <>
              <h2>카드사 선택</h2>
              <div className={styles.grid}>
                {CARD_COMPANIES.map((name) => (
                  <button type="button" key={name} className={card === name ? styles.picked : ""} aria-pressed={card === name} onClick={() => setCard(name)}>
                    💳 {name}
                  </button>
                ))}
              </div>
              <label className={styles.select}>
                <span>할부</span>
                <select value={installment} onChange={(e) => setInstallment(e.target.value)} disabled={amount < INSTALLMENT_MIN}>
                  <option>일시불</option>
                  <option>2개월</option>
                  <option>3개월</option>
                </select>
                {amount < INSTALLMENT_MIN && <small>5만 원 이상부터 할부할 수 있어요</small>}
              </label>
            </>
          )}

          {method === "easy" && (
            <div className={styles.easy}>
              <span aria-hidden="true">📱</span>
              <h2>{EASY_PAY}로 결제 요청을 보냈어요</h2>
              <p>휴대폰 앱에서 승인하는 단계예요. 모의 결제라서 아래 버튼으로 바로 승인할 수 있어요.</p>
            </div>
          )}

          {method === "transfer" && (
            <>
              <h2>은행 선택</h2>
              <div className={styles.grid}>
                {BANKS.map((name) => (
                  <button type="button" key={name} className={bank === name ? styles.picked : ""} aria-pressed={bank === name} onClick={() => setBank(name)}>
                    🏦 {name}
                  </button>
                ))}
              </div>
              <p className={styles.hint}>실제 이체라면 계좌 비밀번호를 입력하는 단계예요. 모의 결제라서 입력하지 않아요.</p>
            </>
          )}

          <label className={styles.check}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>결제 진행 필수 약관에 모두 동의해요 (모의)</span>
          </label>
          <label className={`${styles.check} ${styles.test}`}>
            <input type="checkbox" checked={failTest} onChange={(e) => setFailTest(e.target.checked)} />
            <span>실패 응답 받아보기 (테스트)</span>
          </label>

          <button type="button" className={styles.pay} onClick={approve} disabled={!agreed}>
            {method === "easy" ? `${EASY_PAY} 앱에서 승인하기` : `${won(amount)} 결제하기`}
          </button>
        </div>
      )}

      {step === "approving" && (
        <div className={styles.state} role="status" aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <h2>결제 승인 중이에요</h2>
          <p>창을 닫거나 새로고침하지 마세요.</p>
        </div>
      )}

      {step === "done" && (
        <div className={styles.state} role="status" aria-live="polite">
          <span className={styles.ok} aria-hidden="true">✓</span>
          <h2>결제가 승인됐어요</h2>
          <p>{detail} · {won(amount)}</p>
        </div>
      )}

      {step === "failed" && (
        <div className={styles.state} role="alert">
          <span className={styles.fail} aria-hidden="true">!</span>
          <h2>결제에 실패했어요</h2>
          <p>모의 실패 응답이에요 (잔액 부족). 다른 수단을 고르거나 다시 시도해 주세요.</p>
          <div className={styles.retry}>
            <button type="button" onClick={() => { setFailTest(false); setStep("select"); }}>
              다시 시도
            </button>
            <button type="button" onClick={onCancel}>
              결제 취소
            </button>
          </div>
        </div>
      )}

      <footer className={styles.foot}>연습용 결제창이에요. 실제로 결제되지 않고, 결제 정보도 받지 않아요.</footer>
    </dialog>
  );
}
