import { PAY_METHODS, PICKUP_TYPES } from "@/lib/orders";
import styles from "./Checkout.module.css";

// 주문 정보 입력 칸 — 픽업 이름 · 매장/포장 · 요청사항 · 결제 수단. 약관 동의는 결제창에서 받는다.
// 값은 바깥 form 의 제출 때 FormData 로 읽는다.
export default function CheckoutForm() {
  return (
    <div className={styles.form}>
      <section className={styles.card}>
        <h2>받는 방법</h2>
        <label className={styles.field}>
          <span>
            픽업 이름 <b aria-hidden="true">*</b>
          </span>
          <input name="pickupName" type="text" maxLength={12} placeholder="포션이 나오면 불러 드릴 이름 (예: 별빛 손님)" required />
        </label>
        <fieldset className={styles.choices}>
          <legend>매장 · 포장</legend>
          {Object.entries(PICKUP_TYPES).map(([value, label], index) => (
            <label key={value}>
              <input type="radio" name="pickupType" value={value} defaultChecked={index === 0} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <label className={styles.field}>
          <span>요청사항</span>
          <textarea name="request" rows={2} maxLength={60} placeholder="예) 얼음 적게, 덜 달게" />
        </label>
      </section>

      <section className={styles.card}>
        <h2>결제 수단</h2>
        <fieldset className={styles.choices}>
          <legend className="sr-only">결제 수단</legend>
          {Object.entries(PAY_METHODS).map(([value, label], index) => (
            <label key={value}>
              <input type="radio" name="payMethod" value={value} defaultChecked={index === 0} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
      </section>
    </div>
  );
}
