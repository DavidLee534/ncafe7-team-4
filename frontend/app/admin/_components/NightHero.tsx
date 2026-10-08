// 밤하늘 헤더 — 관리자 페이지 맨 위. 별은 고정 시드로 그려서 서버/브라우저 결과가 같다.
// 바로 아래 덩어리를 헤더 위로 겹치려면 그 요소에 heroOverlap 클래스를 준다.
import type { ReactNode } from "react";
import styles from "./NightHero.module.css";

export const heroOverlap = styles.overlap;

const STARS = (() => {
  let seed = 11;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: 46 }, () => ({
    size: 2 + rand() * 2.5,
    left: rand() * 100,
    top: 6 + rand() * 70,
    opacity: 0.45 + rand() * 0.55,
  }));
})();

// 큰 반짝이 별 위치(%) — 제목 글자 위는 피한다
const SPARKLES = [
  [48, 14],
  [66, 22],
  [84, 55],
  [30, 78],
];

export default function NightHero({
  crumb,
  title,
  description,
  actions,
  cat = false,
}: {
  crumb: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  cat?: boolean;
}) {
  return (
    <section className={`${styles.hero}${cat ? ` ${styles.withCat}` : ""}`}>
      {STARS.map((s, i) => (
        <span
          key={i}
          className={styles.star}
          style={{ width: s.size, height: s.size, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
          aria-hidden="true"
        />
      ))}
      {SPARKLES.map(([x, y]) => (
        <span key={`${x}-${y}`} className={styles.sparkle} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
      ))}

      <div className={styles.row}>
        <div>
          <p className={styles.crumb}>MEW &amp; BREW / {crumb}</p>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {cat && (
        <svg className={styles.cat} viewBox="222 118 236 162" aria-hidden="true">
          <path
            d="M232 280 L232 245 C230 212 236 190 250 176 C248 158 250 140 256 133 Q263 126 271 132 L298 156 Q340 146 382 156 L409 132 Q417 126 424 133 C430 140 432 158 430 176 C444 190 450 212 448 245 L448 280 Z"
            fill="#05061A"
            stroke="#FFF8DC"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="308" cy="212" r="13" fill="#FFF8DC" />
          <circle cx="372" cy="212" r="13" fill="#FFF8DC" />
          <circle cx="311" cy="208" r="8" fill="#05061A" />
          <circle cx="375" cy="208" r="8" fill="#05061A" />
          <circle cx="314" cy="205" r="2.2" fill="#FFF8DC" />
          <circle cx="378" cy="205" r="2.2" fill="#FFF8DC" />
        </svg>
      )}
    </section>
  );
}
