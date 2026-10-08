// 오늘의 냥일지 — 최근에 수정된 메뉴 기록.
import Link from "next/link";
import { recentlyUpdated } from "@/lib/cat";
import type { Menu } from "@/lib/types";
import styles from "./MenuCatalog.module.css";

export default function CatDiary({ menus }: { menus: Menu[] }) {
  return (
    <aside className="m3-card card:outlined card-padding:self" aria-labelledby="diary-title">
      <h2 id="diary-title" className={styles.diaryTitle}>
        🐈 오늘의 냥일지
      </h2>
      <ul className={styles.log}>
        {recentlyUpdated(menus).map((m) => (
          <li key={m.id}>
            <span className={styles.logDate}>{m.updatedAt}</span>
            <Link href={`/admin/menus/${m.id}`} className={styles.logName}>
              {m.korName}
            </Link>
            <span className={styles.logText}>
              {m.createdAt === m.updatedAt ? "새 레시피가 생겼어요." : "레시피를 고쳤어요."}
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.quote}>
        “오늘의 가장 중요한 업무는
        <br />
        따뜻한 커피와 낮잠입니다.”
      </p>
    </aside>
  );
}
