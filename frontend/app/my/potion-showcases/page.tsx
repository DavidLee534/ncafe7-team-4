"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserHeader from "@/app/_components/UserHeader";
import MemberGate from "@/app/potion-showcases/_components/MemberGate";
import { memberApi, dateText, type MyShowcase } from "@/lib/memberApi";
import styles from "../My.module.css";

export default function MyShowcasesPage() {
  const [posts, setPosts] = useState<MyShowcase[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { memberApi<MyShowcase[]>("/my/potion-showcases").then(setPosts).catch(e => setError(e.message)); }, []);
  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}><Link href="/my" className={styles.back}>← 마이페이지</Link><header className={styles.hero}><span className={styles.eyebrow}>MY POTION STORIES</span><h1>내 포션 자랑</h1></header><Link href="/potion-showcases/new" className={styles.button}>새 글 쓰기</Link>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <section className={styles.panel}>{posts.length ? posts.map(post => <div className={styles.row} key={post.id}><div><Link href={`/potion-showcases/${post.id}`}>{post.title}</Link><br /><small>{post.recipeName} · {dateText(post.createdAt)}</small></div><span>★ {post.averageScore.toFixed(1)}</span></div>) : <p className={styles.muted}>작성한 글이 없어요.</p>}</section>
  </div></main></MemberGate></>;
}
