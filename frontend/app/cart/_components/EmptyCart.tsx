import Link from "next/link";
import styles from "./Cart.module.css";

// 빈 장바구니 안내 — 공방과 메뉴 책장으로 이어 준다
export default function EmptyCart() {
  return (
    <section className={styles.empty}>
      <span aria-hidden="true">🧺</span>
      <h2>바구니가 비어 있어요</h2>
      <p>연금 공방에서 재료를 조합해 나만의 포션을 담아 보세요.</p>
      <div>
        <Link href="/menu/alchemy">🪄 포션 조합하러 가기</Link>
        <Link href="/menu">메뉴 책장 둘러보기</Link>
      </div>
    </section>
  );
}
