"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserHeader from "@/app/_components/UserHeader";
import { addServerCartItem } from "@/lib/cart";
import { memberApi, dateText, priceText, type ShowcaseDetail } from "@/lib/memberApi";
import MemberGate from "./MemberGate";
import ShowcaseComments from "./ShowcaseComments";
import styles from "../Showcases.module.css";

export default function ShowcaseDetailView({ id }: { id: number }) {
  const router = useRouter();
  const [post, setPost] = useState<ShowcaseDetail | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { memberApi<ShowcaseDetail>(`/potion-showcases/${id}`).then(data => { setPost(data); setScore(data.myScore ?? 0); }).catch(e => setError(e.message)); }, [id]);
  async function rate(value: number) {
    if (!post) return;
    setBusy(true); setError("");
    try {
      const result = await memberApi<{ averageScore: number; ratingCount: number; myScore: number }>(`/potion-showcases/${id}/ratings`, { method: "PUT", body: JSON.stringify({ score: value }) });
      setScore(result.myScore); setPost({ ...post, ...result }); setNotice("별점을 저장했어요.");
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function remove() {
    if (!confirm("이 게시글을 삭제할까요?")) return;
    setBusy(true); setError("");
    try { await memberApi<void>(`/potion-showcases/${id}`, { method: "DELETE" }); router.push("/potion-showcases"); router.refresh(); }
    catch (e) { setError((e as Error).message); setBusy(false); }
  }
  async function cart() {
    if (!post) return;
    setBusy(true); setError(""); setNotice("");
    try {
      // 서버 장바구니에 담고, 헤더의 장바구니 개수도 다시 읽는다
      await addServerCartItem({ recipeId: post.recipeId });
      setNotice("포션을 장바구니에 담았어요.");
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}><Link className={styles.back} href="/potion-showcases">← 포션 자랑 게시판</Link>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {!post ? <p className={styles.muted}>게시글을 불러오는 중…</p> : <article className={styles.panel}>
      <span className={styles.eyebrow}>{post.recipeGrade.toUpperCase()} POTION</span><h1>{post.title}</h1>
      <p className={styles.muted}>{post.nickname} · {dateText(post.createdAt)}</p>
      <div className={styles.bottle} style={{ background: post.recipeColor, color: post.recipeColor }} aria-hidden="true" />
      <h2>{post.recipeName}</h2><p className={styles.muted}>{priceText(post.recipePrice)} · ★ {post.averageScore.toFixed(1)} ({post.ratingCount}명)</p>
      <p className={styles.detailText}>{post.content || "이 포션에 대한 이야기가 아직 없어요."}</p>
      <div className={styles.actions}><button type="button" className={styles.button} onClick={cart} disabled={busy}>장바구니 담기</button>
        {post.mine && <><Link className={styles.secondary} href={`/potion-showcases/${id}/edit`}>수정</Link><button type="button" className={styles.secondary} onClick={remove} disabled={busy}>삭제</button></>}</div>
      {!post.mine && <section aria-label="별점 주기"><h3>이 포션에 별점 주기</h3><div className={styles.stars}>{[1, 2, 3, 4, 5].map(value => <button key={value} type="button" disabled={busy} onClick={() => rate(value)} aria-label={`${value}점`}>{value <= score ? "★" : "☆"}</button>)}</div></section>}
      {notice && <p role="status" className={styles.success}>{notice}</p>}
      <ShowcaseComments showcaseId={id} />
    </article>}
  </div></main></MemberGate></>;
}
