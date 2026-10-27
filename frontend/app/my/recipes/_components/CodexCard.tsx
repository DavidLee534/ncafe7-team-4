import type { MyRecipe, MySecretRecipe, PotionGrade } from "@/lib/myApi";
import PotionBottle from "./PotionBottle";
import styles from "./RecipeCodex.module.css";

// 도감 칸 하나. 내가 빚은 포션(recipe) 또는 비밀 레시피(secret)
export type CodexEntry = { kind: "recipe"; item: MyRecipe } | { kind: "secret"; item: MySecretRecipe };

const GRADE_LABEL: Record<PotionGrade, string> = { normal: "일반", rare: "✦ 희귀", legend: "✦✦ 전설" };
const GRADE_CLASS: Record<PotionGrade, string> = { normal: styles.badgeBasic, rare: styles.badgeRare, legend: styles.badgeLegend };

export const shortDate = (value: string | null) => (value ? value.slice(0, 10).replace(/-/g, ".") : "");

// 카드와 상세가 같이 쓰는 등급 배지
export function CodexBadge({ entry }: { entry: CodexEntry }) {
  if (entry.kind === "recipe") {
    return <span className={`${styles.badge} ${GRADE_CLASS[entry.item.grade]}`}>{GRADE_LABEL[entry.item.grade]}</span>;
  }
  // 전설은 잠겨 있어도 등급을 보여 줘서 수집 목표가 되게 한다
  const { discovered, grade } = entry.item;
  if (!discovered && grade !== "legend") return <span className={`${styles.badge} ${styles.badgeHidden}`}>미발견</span>;
  return <span className={`${styles.badge} ${GRADE_CLASS[grade]}`}>{GRADE_LABEL[grade]}</span>;
}

export default function CodexCard({ entry, no, selected, onSelect }: { entry: CodexEntry; no: number; selected: boolean; onSelect: () => void }) {
  const locked = entry.kind === "secret" && !entry.item.discovered;
  const title = entry.kind === "recipe" ? entry.item.name : (entry.item.name ?? "? ? ?");
  const meta =
    entry.kind === "recipe"
      ? entry.item.baseMenuName
      : `${entry.item.categoryName ?? "비밀"} 계열`;
  const foot =
    entry.kind === "recipe"
      ? `${shortDate(entry.item.createdAt)} 연성${entry.item.secret ? " · 비밀 조합" : ""}`
      : entry.item.discovered
        ? `${shortDate(entry.item.discoveredAt)} 발견`
        : "아직 못 찾았어요";

  return (
    <button type="button" className={`${styles.card} ${locked ? styles.locked : ""}`} aria-pressed={selected} onClick={onSelect}>
      <span className={styles.no}>No.{String(no).padStart(2, "0")}</span>
      <PotionBottle color={entry.item.color} locked={locked} className={styles.bottle} />
      <span className={`${styles.cardName} ${locked ? styles.qmark : ""}`}>{title}</span>
      <span className={styles.meta}>{meta}</span>
      <CodexBadge entry={entry} />
      <span className={styles.rate}>{foot}</span>
    </button>
  );
}
