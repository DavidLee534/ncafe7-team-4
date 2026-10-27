"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserHeader from "@/app/_components/UserHeader";
import { memberApi, dateText, type Showcase } from "@/lib/memberApi";
import MemberGate from "./_components/MemberGate";
import styles from "./Showcases.module.css";

export default function PotionShowcasesPage() {
  const [sort, setSort] = useState<"latest" | "rating">("latest");
  const [list, setList] = useState<Showcase[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    memberApi<Showcase[]>(`/potion-showcases?sort=${sort}`)
      .then(data => { if (active) { setList(data); setError(""); } })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [sort]);
  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}>
    <header className={styles.hero}><div><span className={styles.eyebrow}>POTION SHOWCASE</span><h1>포션 자랑 게시판</h1><p>수습생들이 만든 포션을 구경하고 별점을 남겨 보세요.</p></div><Link className={styles.button} href="/potion-showcases/new">✨ 내 포션 자랑하기</Link></header>
    <div className={styles.toolbar}><button type="button" className={sort === "latest" ? styles.active : ""} onClick={() => { setLoading(true); setSort("latest"); }}>최신순</button><button type="button" className={sort === "rating" ? styles.active : ""} onClick={() => { setLoading(true); setSort("rating"); }}>별점순</button></div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {loading ? <p className={styles.muted}>게시글을 불러오는 중…</p> : list.length === 0 ? <p className={styles.empty}>아직 자랑한 포션이 없어요. 첫 글을 남겨 주세요.</p> : <div className={styles.grid}>{list.map(post => <Link href={`/potion-showcases/${post.id}`} className={styles.card} key={post.id}><div className={styles.bottle} style={{ background: post.recipeColor, color: post.recipeColor }} aria-hidden="true" /><span className={styles.eyebrow}>{post.recipeGrade.toUpperCase()}</span><h2>{post.title}</h2><p>{post.recipeName}</p><div className={styles.meta}><span>★ {post.averageScore.toFixed(1)} ({post.ratingCount})</span><span>{post.nickname}</span></div><small className={styles.muted}>{dateText(post.createdAt)}</small></Link>)}</div>}
  </div></main></MemberGate></>;
}
