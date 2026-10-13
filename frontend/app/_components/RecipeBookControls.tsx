import styles from "./RecipeBook.module.css";

type Props = {
  page: number;
  total: number;
  description: string;
  onTurn: (page: number) => void;
};

export default function RecipeBookControls({
  page,
  total,
  description,
  onTurn,
}: Props) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        onClick={() => onTurn(page - 1)}
        disabled={page === 0}
      >
        ← 이전 장
      </button>
      <p>
        <b>{page + 1}</b> / {total} · {description}
      </p>
      <button
        type="button"
        onClick={() => onTurn(page + 1)}
        disabled={page === total - 1}
      >
        다음 장 →
      </button>
    </div>
  );
}
