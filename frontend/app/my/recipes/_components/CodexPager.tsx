import styles from "./RecipeCodex.module.css";

export default function CodexPager({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;
  return (
    <nav className={styles.pager} aria-label="도감 쪽 넘기기">
      <button type="button" className={styles.pgArrow} disabled={page === 0} onClick={() => onChange(page - 1)}>‹ 이전 쪽</button>
      <div className={styles.pgNums}>
        {Array.from({ length: pages }, (_, k) => (
          <button key={k} type="button" className={styles.pgNum} aria-current={k === page ? "page" : undefined} aria-label={`${k + 1}쪽`} onClick={() => onChange(k)}>
            {k + 1}
          </button>
        ))}
      </div>
      <button type="button" className={styles.pgArrow} disabled={page === pages - 1} onClick={() => onChange(page + 1)}>다음 쪽 ›</button>
    </nav>
  );
}
