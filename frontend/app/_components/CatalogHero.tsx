// 손님 카탈로그 화면의 밤하늘 소개 영역 — 관리자 메뉴 목록의 소개(MenuListHero)와 같은 모양.
// 배경 그림 · 작은 머리말 · 제목 · 설명 · 버튼 줄 · 오른쪽 아래 메모를 받는다.
import type { CSSProperties, ReactNode } from "react";
import styles from "./Catalog.module.css";

type Props = {
  image: string; // public/ 아래 그림 경로
  kicker: string;
  title: ReactNode; // <em> 으로 감싼 부분은 금색
  description: ReactNode;
  actions?: ReactNode;
  notes?: string[];
};

export default function CatalogHero({ image, kicker, title, description, actions, notes = [] }: Props) {
  return (
    <section className={styles.storyHero} style={{ "--hero-image": `url("${image}")` } as CSSProperties}>
      <div className={styles.storyCopy}>
        <span className={styles.storyKicker}>{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {actions && <div className={styles.storyActions}>{actions}</div>}
      </div>
      {notes.length > 0 && (
        <div className={styles.spellNotes} aria-hidden="true">
          {notes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>
      )}
    </section>
  );
}
