import Link from "next/link";
import type { CodexEntry } from "@/lib/codex";
import { won } from "@/lib/format";
import { CodexBadge } from "./CodexCard";
import PotionBottle from "./PotionBottle";
import styles from "./RecipeCodex.module.css";

const dot = (date: string) => date.replace(/-/g, ".");

function Rarity({ entry }: { entry: CodexEntry }) {
  const rate = entry.customerRate;
  const label = entry.kind === "secret" ? "이 레시피를 찾은 손님" : "이 포션을 연성해 본 손님";
  const line = rate < 5 ? "공방에서 손꼽히게 귀한 레시피예요." : rate < 15 ? "열 명 중 한 명꼴로 찾았어요." : rate < 50 ? "찾은 손님이 꽤 있어요." : "많은 손님이 즐겨 찾아요.";
  return (
    <div className={styles.rarity}>
      {label} <b>{rate}%</b>
      <div className={styles.rarityBar}><i style={{ width: `${Math.max(rate, 2)}%` }} /></div>
      <div className={styles.rarityLine}>{line}</div>
    </div>
  );
}

// 오른쪽 상세. 메뉴 상세(옵션·장바구니)와 겹치지 않게 "기록"만 보여 주고, 연성은 연금 공방으로 보낸다.
export default function CodexDetail({ entry, hiddenSecrets }: { entry: CodexEntry; hiddenSecrets: number }) {
  const locked = !entry.foundAt;

  return (
    <>
      <div className={styles.art}><PotionBottle color={entry.color} locked={locked} /></div>
      <CodexBadge entry={entry} />

      {entry.kind === "secret" ? (
        locked ? (
          <>
            <h2>아직 열리지 않은 레시피</h2>
            <div className={styles.sub}>{entry.group} 계열 · 재료 {entry.ingredients.length}개</div>
            <h3>모카 점장의 수수께끼</h3>
            <p className={styles.riddle}>“{entry.riddle}”</p>
            <h3>비밀 조합</h3>
            <div className={styles.chips}>{entry.ingredients.map((_, i) => <span key={i} className={styles.chipQ}>?</span>)}</div>
            <Rarity entry={entry} />
            <Link href="/menu/alchemy" className={styles.go}>연금 공방에서 찾아보기</Link>
          </>
        ) : (
          <>
            <h2>{entry.name}</h2>
            <div className={styles.sub}>{entry.group} 계열</div>
            <p className={styles.desc}>{entry.description}</p>
            <h3>비밀 조합</h3>
            <div className={styles.chips}>{entry.ingredients.map((name) => <span key={name}>{name}</span>)}</div>
            <p className={styles.found}>{dot(entry.foundAt!)} 발견</p>
            <Rarity entry={entry} />
            <Link href="/menu/alchemy" className={styles.go}>이 조합으로 다시 연성하기</Link>
          </>
        )
      ) : (
        <>
          <h2>{locked ? entry.baseName : entry.name}</h2>
          <div className={styles.sub}>{locked ? `${entry.group} · 아직 연성하지 않았어요` : `${entry.baseName} · ${entry.group} · ${won(entry.price)}`}</div>
          {locked ? (
            <p className={styles.desc}>연금 공방에서 기반 재료로 한 번 연성하면 연금술 이름과 설명이 열려요.</p>
          ) : (
            <>
              <p className={styles.desc}>{entry.description}</p>
              <p className={styles.found}>{dot(entry.foundAt!)} 첫 연성</p>
            </>
          )}
          <Rarity entry={entry} />
          <Link href="/menu/alchemy" className={styles.go}>{locked ? "연금 공방에서 연성하기" : "다시 연성하기"}</Link>
        </>
      )}

      <div className={styles.moka}>
        <span className={styles.mokaFace} aria-hidden="true">🐱</span>
        <div>
          <small>MOKA&apos;S NOTE</small>
          {entry.kind === "secret" && locked
            ? "힌트는 여기까지다냥. 나머지는 공방에서 직접 찾아보라냥."
            : `비밀 레시피가 아직 ${hiddenSecrets}개 숨어 있다냥. 전설은 손님 백 명 중 두세 명만 찾았다냥.`}
        </div>
      </div>
    </>
  );
}
