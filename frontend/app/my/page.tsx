"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserHeader from "@/app/_components/UserHeader";
import { useAuth } from "@/app/_components/AuthContext";
import MemberGate from "@/app/potion-showcases/_components/MemberGate";
import { memberApi, dateText, priceText, type Account, type Membership, type MyOrder, type MyRecipe, type MyShowcase } from "@/lib/memberApi";
import styles from "./My.module.css";

type ServerData = {
  account: Account;
  membership: Membership;
  orders: MyOrder[];
  showcases: MyShowcase[];
  recipes: MyRecipe[];
};

export default function MyPage() {
  const { member, ready } = useAuth();
  const [server, setServer] = useState<ServerData | null>(null);
  const [serverStatus, setServerStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    if (!ready || !member) return;
    let active = true;
    Promise.all([
      memberApi<Account>("/my/account"),
      memberApi<Membership>("/my/membership"),
      memberApi<MyOrder[]>("/my/orders?size=3"),
      memberApi<MyShowcase[]>("/my/gallery-posts?size=3"),
      memberApi<MyRecipe[]>("/my/recipes"),
    ]).then(([account, membership, orders, showcases, recipes]) => {
      if (active) { setServer({ account, membership, orders, showcases, recipes }); setServerStatus("ready"); }
    }).catch(() => { if (active) setServerStatus("unavailable"); });
    return () => { active = false; };
  }, [ready, member]);

  // 화면의 로그인 정보와 서버 세션의 계정이 같은지 확인한다.
  const connected = Boolean(server && member && server.account.email.toLowerCase() === member.email.toLowerCase());
  const serverData = connected ? server : null;
  const membershipCount = serverData?.membership.orderCount;
  const membershipName = serverData?.membership.name;
  const nextLevelAt = serverData?.membership.nextLevelAt;

  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}>
    <header className={styles.hero}><span className={styles.eyebrow}>MOONLIGHT GUESTBOOK</span><h1>나의 마이페이지</h1><p className={styles.muted}>내 포션과 주문, 공방 활동을 한곳에서 살펴보세요.</p></header>
    <section className={styles.panel} aria-label="회원 프로필">
      <span className={styles.eyebrow}>MOONLIGHT MEMBER</span><h2>{member?.name ?? "손님"} 님</h2>
      <p className={styles.muted}>{member?.email ?? ""}</p>
      {serverData && <p>멤버십: <b>{membershipName}</b> · 누적 주문 {membershipCount}건{nextLevelAt != null && ` · 다음 등급까지 ${Math.max(0, nextLevelAt - (membershipCount ?? 0))}건`}</p>}
      {connected && <Link className={styles.secondary} href="/my/account">계정 관리</Link>}
    </section>
    {serverStatus === "unavailable" && <p role="alert" className={styles.muted}>주문과 회원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
    {serverStatus === "ready" && !connected && <p role="status" className={styles.muted}>로그인 정보가 일치하지 않습니다. 다시 로그인해 주세요.</p>}
    <div className={`${styles.grid} ${styles.overview}`}>
      <div className={styles.card}>저장한 포션<strong>{serverData ? serverData.recipes.length : "—"}</strong><Link className={styles.link} href="/my/recipes">도감 보기 →</Link></div>
      <div className={styles.card}>포션 자랑 글<strong>{serverData ? `${serverData.showcases.length}${serverData.showcases.length === 3 ? "+" : ""}` : "—"}</strong>{serverData ? <Link className={styles.link} href="/potion-showcases">게시판 보기 →</Link> : <span className={styles.muted}>서버 연결 후 확인 가능</span>}</div>
    </div>
    {serverData && <section id="orders" className={styles.panel}>
      <h2>주문 내역</h2>
      {serverData.orders.length ? serverData.orders.map(order => <div className={styles.row} key={order.id}>
        <div><Link href={`/my/orders/${order.id}`}>{order.itemSummary}</Link><br /><small>{order.orderNumber} · {dateText(order.createdAt)}</small></div>
        <span>{priceText(order.totalPrice)} · {order.status === "ordered" ? "접수 완료" : order.status}</span>
      </div>) : <p className={styles.muted}>주문 내역이 없어요.</p>}
      <div className={styles.actions}><Link className={styles.secondary} href="/my/orders">전체 주문 보기</Link></div>
    </section>}
    <section className={styles.panel}>
      <h2>내 포션 자랑</h2>
      {serverData?.showcases.length ? serverData.showcases.map(post => <div className={styles.row} key={post.id}>
        <Link href={`/potion-showcases/${post.id}`}>{post.title}</Link><span>{post.recipeName} · ★ {post.averageScore.toFixed(1)}</span>
      </div>) : <p className={styles.muted}>{serverData ? "아직 자랑한 포션이 없어요." : "서버 계정이 연결되면 내 글을 볼 수 있어요."}</p>}
      {serverData && <div className={styles.actions}><Link className={styles.secondary} href="/my/potion-showcases">내 글 모두 보기</Link><Link className={styles.button} href="/potion-showcases/new">포션 자랑하기</Link></div>}
    </section>
  </div></main></MemberGate></>;
}
