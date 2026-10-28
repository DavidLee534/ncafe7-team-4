"use client";
// 오른쪽 상세. 목록 값으로 먼저 그리고, 목록에 없는 값(찾은 손님 비율, 기반 메뉴 설명, 맞힌 비밀 레시피, 재료 조합)은
// 칸을 고를 때 백엔드 상세(/api/v1/my/...)에서 받아 채운다.
// 메뉴 상세(옵션·장바구니)와 겹치지 않게 "기록"만 보여 주고, 연성은 연금 공방으로 보낸다.
import { useEffect, useState } from "react";
import Link from "next/link";
import type { MyRecipeDetail, MySecretRecipeDetail } from "@/lib/myApi";
import { won } from "@/lib/format";
import { CodexBadge, shortDate, type CodexEntry } from "./CodexCard";
import PotionBottle from "./PotionBottle";
import styles from "./RecipeCodex.module.css";

function Rarity({ rate }: { rate: number }) {
  const line = rate < 5 ? "공방에서 손꼽히게 귀한 레시피예요." : rate < 15 ? "열 명 중 한 명꼴로 찾았어요." : rate < 50 ? "찾은 손님이 꽤 있어요." : "많은 손님이 찾았어요.";
  return (
    <div className={styles.rarity}>
      이 레시피를 찾은 손님 <b>{rate}%</b>
      <div className={styles.rarityBar}><i style={{ width: `${Math.max(rate, 2)}%` }} /></div>
      <div className={styles.rarityLine}>{line}</div>
    </div>
  );
}

// 재료 조합 칩. 못 찾은 비밀 레시피는 개수만큼 "?" 로
function Combo({ title, names, count }: { title: string; names?: string[] | null; count?: number }) {
  const hidden = !names;
  const size = names?.length ?? count ?? 0;
  if (size === 0) return null;
  return (
    <>
      <h3>{title}</h3>
      <div className={styles.chips}>
        {hidden
          ? Array.from({ length: size }, (_, i) => <span key={i} className={styles.chipQ}>?</span>)
          : names.map((name) => <span key={name}>{name}</span>)}
      </div>
    </>
  );
}

type Loaded = { key: string; recipe?: MyRecipeDetail; secret?: MySecretRecipeDetail };

export default function CodexDetail({ entry, hiddenSecrets }: { entry: CodexEntry; hiddenSecrets: number }) {
  const key = `${entry.kind}-${entry.item.id}`;
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let alive = true;
    const path = entry.kind === "recipe" ? `/api/v1/my/recipes/${entry.item.id}` : `/api/v1/my/secret-recipes/${entry.item.id}`;
    fetch(path)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        setLoaded(entry.kind === "recipe" ? { key, recipe: data } : { key, secret: data });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [key, entry.kind, entry.item.id]);

  const detail = loaded?.key === key ? loaded : null;

  if (entry.kind === "recipe") {
    const r = entry.item;
    return (
      <>
        <div className={styles.art}><PotionBottle color={r.color} locked={false} /></div>
        <CodexBadge entry={entry} />
        <h2>{r.name}</h2>
        <div className={styles.sub}>{r.baseMenuName} 기반 · {won(r.price)}</div>
        {detail?.recipe?.baseMenuDescription && <p className={styles.desc}>{detail.recipe.baseMenuDescription}</p>}
        {detail?.recipe?.secretRecipeName && (
          <p className={styles.desc}>✦ 비밀 레시피 「{detail.recipe.secretRecipeName}」 조합으로 빚었어요.</p>
        )}
        <Combo title="넣은 재료" names={detail?.recipe?.ingredients} />
        <p className={styles.found}>{shortDate(r.createdAt)} 연성</p>
        <Link href="/recipes/new" className={styles.go}>연금 공방에서 다시 빚기</Link>
        <div className={styles.moka}>
          <span className={styles.mokaFace} aria-hidden="true">🐱</span>
          <div>
            <small>MOKA&apos;S NOTE</small>
            {`비밀 레시피가 아직 ${hiddenSecrets}개 숨어 있다냥. 재료 조합을 바꿔 보라냥.`}
          </div>
        </div>
      </>
    );
  }

  const s = entry.item;
  return (
    <>
      <div className={styles.art}><PotionBottle color={s.color} locked={!s.discovered} /></div>
      <CodexBadge entry={entry} />
      {s.discovered ? (
        <>
          <h2>{s.name}</h2>
          <div className={styles.sub}>{s.categoryName ?? "비밀"} 계열</div>
          {s.description && <p className={styles.desc}>{s.description}</p>}
          <Combo title="비밀 조합" names={detail?.secret?.ingredients} />
          <p className={styles.found}>{shortDate(s.discoveredAt)} 발견</p>
        </>
      ) : (
        <>
          <h2>아직 열리지 않은 레시피</h2>
          <div className={styles.sub}>{s.categoryName ?? "비밀"} 계열</div>
          <h3>모카 점장의 수수께끼</h3>
          <p className={styles.riddle}>“{s.riddle ?? "…"}”</p>
          <Combo title="비밀 조합" names={null} count={detail?.secret?.ingredientCount} />
        </>
      )}
      {detail?.secret && <Rarity rate={detail.secret.customerRate} />}
      <Link href="/recipes/new" className={styles.go}>{s.discovered ? "이 조합으로 다시 빚기" : "연금 공방에서 찾아보기"}</Link>
      <div className={styles.moka}>
        <span className={styles.mokaFace} aria-hidden="true">🐱</span>
        <div>
          <small>MOKA&apos;S NOTE</small>
          {s.discovered
            ? `비밀 레시피가 아직 ${hiddenSecrets}개 숨어 있다냥.`
            : "힌트는 여기까지다냥. 나머지는 공방에서 직접 찾아보라냥."}
        </div>
      </div>
    </>
  );
}
