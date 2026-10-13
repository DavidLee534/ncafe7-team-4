import Link from "next/link";
import styles from "./MenuCatalog.module.css";

export default function MenuStoryHero() {
  return (
    <section className={styles.storyHero}>
      <div className={styles.storyGlow} aria-hidden="true" />
      <div className={styles.storyCopy}>
        <span className={styles.storyKicker}>
          🌙 MIDNIGHT ONLY · CAT WIZARD BAKERY
        </span>
        <h1>
          냥이 발자국 빵집
          <br />
          <em>비밀 메뉴 공방</em>
        </h1>
        <p>
          인간들이 잠든 밤, 고양이 마법사들이 젤리 반죽을 꾹꾹 눌러 달콤한
          주문을 굽습니다.
        </p>
        <div className={styles.storyActions}>
          <Link
            href="/admin/menus/create"
            className="m3-btn btn-size:md btn-icon:leading"
          >
            <i className="m3-icon icon:add" aria-hidden="true" />
            마법 메뉴 등록
          </Link>
          <span>🐾 모카 점장 근무 중</span>
        </div>
      </div>
      <div className={styles.spellNotes} aria-label="오늘의 공방 상태">
        <span>✨ 별가루 오븐 예열 완료</span>
        <span>🫧 젤리 반죽 발효 중</span>
      </div>
    </section>
  );
}
