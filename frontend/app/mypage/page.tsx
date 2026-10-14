"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../_components/AuthContext";
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
  const { member, ready, signOut } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (ready && !member) router.replace("/login");
  }, [member, ready, router]);

  if (!ready || !member) return <><UserHeader /><main className={styles.page} aria-busy="true" /></>;
  const isMember = Boolean(member);
  const displayName = member?.name ?? "비회원 손님";
  return <><UserHeader /><main className={styles.page}>
    <header className={styles.hero}>
      <span>MOONLIGHT GUESTBOOK</span>
      <h1>모카 점장의<br /><em>손님 장부</em></h1>
      <p>{isMember ? `${displayName} 수습생의 공방 기록을 한곳에서 살펴보세요.` : "지금은 비회원 손님으로 공방을 둘러보고 있어요. 메뉴와 포션 조합은 그대로 즐길 수 있답니다냥."}</p>
    </header>
    <section className={styles.profile} aria-label={isMember ? "회원 프로필" : "비회원 프로필"}>
      <div className={styles.avatar}><img src="/images/moka-auth-mascot.png" alt="마법사 모자를 쓴 고양이 점장 모카" /></div>
      <div><span>{isMember ? "MOONLIGHT APPRENTICE" : "GUEST ALCHEMIST"}</span><h2>{displayName}</h2><p>{isMember ? `${member?.email} · 모카 점장의 공방 수습생` : "로그인하면 나만의 공방 기록을 이어서 보관할 수 있어요."}</p></div>
      <div className={styles.profileActions}>{isMember ? <button type="button" onClick={signOut} style={{ padding: ".75rem .9rem", border: "1px solid #65536d", borderRadius: ".75rem", background: "transparent", color: "#f5e8d5", fontSize: ".8rem", fontWeight: 900 }}>로그아웃</button> : <><Link href="/login">로그인</Link><Link href="/signup">회원가입</Link></>}</div>
    </section>
    <section className={styles.summary}>
      <article><small>저장된 레시피</small><strong>{isMember ? "0" : "—"}</strong><p>{isMember ? "새 포션을 저장해 보세요" : "로그인 후 저장 가능"}</p></article>
      <article><small>발견한 비밀 레시피</small><strong>{isMember ? "0" : "—"}</strong><p>{isMember ? "공방을 둘러보며 도감을 채워요" : "로그인 후 도감에 기록"}</p></article>
      <OrderCountCard />
    </section>
    <MyOrderHistory />
    <section className={styles.benefits} aria-label="회원 기능 안내">
      {benefits.map(([icon, title, description]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{description}</p></article>)}
    </section>
    <Link href="/menu" className={styles.menuLink}>{isMember ? "🌙 메뉴 책장으로 돌아가기" : "🌙 비회원으로 메뉴 계속 둘러보기"}</Link>
  </main></>;
}
