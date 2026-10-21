// 최근 수정 메뉴 — 모카 점장의 발자국. 최근에 등록 · 수정된 메뉴를 날짜와 함께 보여준다.
// 정렬과 개수는 백엔드가 한다 (?sort=updatedAt&size=5). 받은 순서 그대로 보여준다.
import Link from "next/link";
import type { Menu } from "@/lib/types";
import styles from "./MenuList.module.css";

export default function MenuListRecent({ menus }: { menus: Menu[] }) {
  return (
    <aside className={`m3-card card:outlined card-padding:self ${styles.diary}`} aria-labelledby="diary-title">
      <div className={styles.diaryHeader}>
        <span aria-hidden="true">🐈</span>
        <div>
          <span className={styles.eyebrow}>MANAGER&apos;S NOTE</span>
          <h2 id="diary-title" className={styles.diaryTitle}>모카 점장의 발자국</h2>
        </div>
      </div>
      <p className={styles.diaryLead}>“메뉴는 매일 새로 확인해야 해요. 간식만큼 중요하니까요!”</p>
      <ul className={styles.log}>
        {menus.map((menu) => (
          <li key={menu.id}>
            <span className={styles.logDate}>{menu.updatedAt}</span>
            <Link href={`/admin/menus/${menu.id}`} className={styles.logName}>{menu.korName}</Link>
            <span className={styles.logText}>
              {menu.createdAt === menu.updatedAt ? "새 메뉴에 발도장을 남겼어요." : "메뉴 정보를 다시 살펴봤어요."}
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.quote}>오늘의 임무: 맛있는 메뉴를 지키고<br />손님에게 꼬리를 흔들기 🐾</p>
    </aside>
  );
}
