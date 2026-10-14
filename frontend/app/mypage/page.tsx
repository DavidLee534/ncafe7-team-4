import Link from "next/link";
import UserHeader from "../_components/UserHeader";
import MyOrderHistory from "./_components/MyOrderHistory";
import OrderCountCard from "./_components/OrderCountCard";
import styles from "./MyPage.module.css";

const benefits = [
  ["📖", "나의 포션 도감", "발견한 비밀 레시피와 조합 기록을 모아 봐요."],
  ["🧾", "주문·모의 결제 내역", "공방에서 만든 주문을 한곳에서 확인해요."],
  ["✨", "저장한 레시피", "마음에 든 재료 조합을 다음에도 바로 불러와요."],
];

export default function MyPage() {
  return <><UserHeader /><main className={styles.page}>
    <header className={styles.hero}>
      <span>MOONLIGHT GUESTBOOK</span>
      <h1>모카 점장의<br /><em>손님 장부</em></h1>
      <p>지금은 비회원 손님으로 공방을 둘러보고 있어요. 메뉴와 포션 조합은 그대로 즐길 수 있답니다냥.</p>
    </header>
    <section className={styles.profile} aria-label="비회원 프로필">
      <div className={styles.avatar}><img src="/images/moka-auth-mascot.png" alt="마법사 모자를 쓴 고양이 점장 모카" /></div>
      <div><span>GUEST ALCHEMIST</span><h2>비회원 손님</h2><p>로그인하면 나만의 공방 기록을 이어서 보관할 수 있어요.</p></div>
      <div className={styles.profileActions}><Link href="/login">로그인</Link><Link href="/signup">회원가입</Link></div>
    </section>
    <section className={styles.summary}>
      <article><small>저장된 레시피</small><strong>—</strong><p>로그인 후 저장 가능</p></article>
      <article><small>발견한 비밀 레시피</small><strong>—</strong><p>로그인 후 도감에 기록</p></article>
      <OrderCountCard />
    </section>
    <MyOrderHistory />
    <section className={styles.unlock}>
      <div><span>✦ MOKA&apos;S NOTE</span><h2>공방의 기록은 계정에 안전하게 보관돼요.</h2><p>회원이 되면 포션 조합 결과, 도감, 주문·모의 결제 내역을 한 장부에서 확인할 수 있어요.</p></div>
      <Link href="/signup">수습생 등록하기</Link>
    </section>
    <section className={styles.benefits} aria-label="회원 기능 안내">
      {benefits.map(([icon, title, description]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{description}</p></article>)}
    </section>
    <Link href="/menu" className={styles.menuLink}>🌙 비회원으로 메뉴 계속 둘러보기</Link>
  </main></>;
}
