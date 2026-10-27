"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import UserHeader from "@/app/_components/UserHeader";
import { memberApi, type MyRecipe, type ShowcaseDetail } from "@/lib/memberApi";
import MemberGate from "./MemberGate";
import styles from "../Showcases.module.css";

export default function ShowcaseForm({ id }: { id?: number }) {
  const router = useRouter();
  const [recipes, setRecipes] = useState<MyRecipe[]>([]);
  const [recipeId, setRecipeId] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (id) {
      memberApi<ShowcaseDetail>(`/potion-showcases/${id}`).then(post => {
        if (!post.mine) { setError("작성자만 수정할 수 있습니다."); return; }
        setRecipeId(post.recipeId); setTitle(post.title); setContent(post.content ?? "");
      }).catch(e => setError(e.message));
    } else {
      memberApi<MyRecipe[]>("/my/recipes").then(data => { setRecipes(data); setRecipeId(data[0]?.id ?? 0); }).catch(e => setError(e.message));
    }
  }, [id]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id && !recipeId) { setError("먼저 도감에 포션을 만들어 주세요."); return; }
    setBusy(true); setError("");
    try {
      const post = await memberApi<ShowcaseDetail>(id ? `/potion-showcases/${id}` : "/potion-showcases", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(id ? { title, content } : { recipeId, title, content }),
      });
      router.push(`/potion-showcases/${post.id}`);
      router.refresh();
    } catch (e) { setError((e as Error).message); setBusy(false); }
  }
  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}><Link className={styles.back} href={id ? `/potion-showcases/${id}` : "/potion-showcases"}>← 게시판으로</Link><section className={styles.panel}>
    <span className={styles.eyebrow}>POTION STORY</span><h1>{id ? "포션 자랑 수정" : "내 포션 자랑하기"}</h1>
    {!id && recipes.length === 0 && <p className={styles.muted}>도감에 저장된 포션이 없으면 글을 쓸 수 없어요. <Link className={styles.back} href="/codex">도감 보러 가기</Link></p>}
    <form onSubmit={submit}>
      {!id && <label className={styles.field}>자랑할 포션<select value={recipeId} onChange={e => setRecipeId(Number(e.target.value))} required>{recipes.map(recipe => <option value={recipe.id} key={recipe.id}>{recipe.name} · {recipe.price.toLocaleString()}원</option>)}</select></label>}
      <label className={styles.field}>제목<input value={title} onChange={e => setTitle(e.target.value)} maxLength={50} required placeholder="내 포션의 이야기를 들려주세요" /></label>
      <label className={styles.field}>내용<textarea value={content} onChange={e => setContent(e.target.value)} maxLength={2000} placeholder="어떤 포션인지 소개해 주세요" /></label>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.actions}><button className={styles.button} type="submit" disabled={busy || (!id && !recipeId)}>{busy ? "저장 중…" : id ? "수정 저장" : "게시하기"}</button></div>
    </form>
  </section></div></main></MemberGate></>;
}
