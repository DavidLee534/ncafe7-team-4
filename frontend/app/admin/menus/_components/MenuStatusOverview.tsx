import styles from "./MenuCatalog.module.css";

type Counts = { all: number; on: number; soldout: number; hidden: number };

const summaries = [
  { label: "전체 메뉴", key: "all", tone: "neutral", icon: "✦" },
  { label: "판매 가능", key: "on", tone: "success", icon: "🐾" },
  { label: "일시 품절", key: "soldout", tone: "warning", icon: "🐟" },
  { label: "비공개", key: "hidden", tone: "muted", icon: "💤" },
] as const;

export default function MenuStatusOverview({ counts }: { counts: Counts }) {
  return (
    <section
      className={`${styles.overview} ${styles.storyOverlap}`}
      aria-label="메뉴 운영 현황"
    >
      <div className={styles.overviewIntro}>
        <span className={styles.mascotFace} aria-hidden="true">
          🐱
        </span>
        <span className={styles.eyebrow}>MOKA’S CHECK-IN</span>
        <p>점장 모카의 아침 점검</p>
        <span>발바닥 도장으로 오늘의 메뉴 상태를 확인해요.</span>
      </div>
      <ul className={styles.metrics}>
        {summaries.map((item) => (
          <li
            key={item.key}
            className={`${styles.metric} ${styles[`metric${item.tone}`]}`}
          >
            <span className={styles.metricPaw} aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
            <strong>{counts[item.key]}</strong>
            <small>개</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
