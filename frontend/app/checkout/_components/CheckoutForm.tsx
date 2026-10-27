import styles from "./Checkout.module.css";

export default function CheckoutForm() {
  return <div className={styles.form}>
    <section className={styles.card}>
      <h2>받는 방법</h2>
      <label className={styles.field}><span>픽업 이름 <b aria-hidden="true">*</b></span>
        <input name="pickupName" type="text" maxLength={12} placeholder="포션이 나오면 불러 드릴 이름" required />
      </label>
      <fieldset className={styles.choices}><legend>매장 · 포장</legend>
        <label><input type="radio" name="pickupType" value="dine-in" defaultChecked /><span>매장에서 마실게요</span></label>
        <label><input type="radio" name="pickupType" value="takeout" /><span>포장해 갈게요</span></label>
      </fieldset>
      <label className={styles.field}><span>요청사항</span>
        <textarea name="request" rows={2} maxLength={60} placeholder="예) 얼음 적게, 덜 달게" />
      </label>
    </section>
    <section className={styles.card}><h2>결제 안내</h2><p>온라인 결제는 준비 중입니다. 포션을 받을 때 매장에서 결제해 주세요.</p></section>
  </div>;
}
