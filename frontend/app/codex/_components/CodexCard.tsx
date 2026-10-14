import type { CodexEntry } from "@/lib/codex";
import PotionBottle from "./PotionBottle";
import styles from "./RecipeCodex.module.css";

const GRADE_LABEL = { rare: "✦ 희귀", legend: "✦✦ 전설" } as const;

// 카드와 상세가 같이 쓰는 등급 배지
export function CodexBadge({ entry }: { entry: CodexEntry }) {
  if (entry.kind === "basic") {
    return entry.foundAt ? <span className={`${styles.badge} ${styles.badgeBasic}`}>기본 포션</span> : <span className={`${styles.badge} ${styles.badgeHidden}`}>미연성</span>;
  }
  // 전설은 잠겨 있어도 등급을 보여 줘서 수집 목표가 되게 한다
  if (!entry.foundAt && entry.grade !== "legend") return <span className={`${styles.badge} ${styles.badgeHidden}`}>미발견</span>;
  return <span className={`${styles.badge} ${entry.grade === "legend" ? styles.badgeLegend : styles.badgeRare}`}>{GRADE_LABEL[entry.grade]}</span>;
}

export default function CodexCard({ entry, selected, onSelect }: { entry: CodexEntry; selected: boolean; onSelect: () => void }) {
  const locked = !entry.foundAt;
  const title = locked ? (entry.kind === "basic" ? entry.baseName : "? ? ?") : entry.name;
  const meta = entry.kind === "secret" ? `${entry.group} · 재료 ${entry.ingredients.length}개` : entry.group + (locked ? "" : ` · ${entry.baseName}`);

  return (
    <button type="button" className={`${styles.card} ${locked ? styles.locked : ""}`} aria-pressed={selected} onClick={onSelect}>
      <span className={styles.no}>No.{String(entry.no).padStart(2, "0")}</span>
      <PotionBottle color={entry.color} locked={locked} className={styles.bottle} />
      <span className={`${styles.cardName} ${locked && entry.kind === "secret" ? styles.qmark : ""}`}>{title}</span>
      <span className={styles.meta}>{meta}</span>
      <CodexBadge entry={entry} />
      <span className={styles.rate}>손님 {entry.customerRate}% 발견</span>
    </button>
  );
}
