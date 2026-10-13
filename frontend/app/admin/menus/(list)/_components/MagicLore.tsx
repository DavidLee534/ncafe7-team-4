import styles from "./MenuCatalog.module.css";

const staff = [
  ["치즈", "총괄 마법사", "🔥", "불 조절 마법으로 식빵을 황금빛으로 구워요."],
  ["턱시도", "반죽 마법사", "🐾", "정밀한 젤리 압력으로 완벽한 타르트지를 만들어요."],
  ["삼색이", "허브 마법사", "🌿", "비밀 향신료와 캣닙 향의 균형을 찾아요."],
];

export default function MagicLore() {
  return (
    <section className={styles.lore} aria-labelledby="lore-title">
      <div className={styles.book}>
        <div className={styles.bookPage}><span>SECRET RECIPE · 01</span><h2 id="lore-title">비밀 레시피북</h2><p>책장을 살며시 넘기면, 밤의 공방에서만 볼 수 있는 메뉴가 나타나요.</p><div className={styles.macaroon} aria-label="행운의 젤리 마카롱">🐾</div><b>행운의 젤리 마카롱</b><small>젤리 발바닥을 살짝 눌러 보세요.</small></div>
        <div className={styles.bookPage}><span>MOONLIGHT SPECIAL</span><div className={styles.recipeItem}>🍞<div><b>식빵 고양이의 식빵</b><small>웅크린 냥이처럼 포근한 시그니처 브레드</small></div></div><div className={styles.recipeItem}>🌙<div><b>달빛 한 스푼 마들렌</b><small>초승달을 닮은 따뜻한 노란 마들렌</small></div></div></div>
      </div>
      <div className={styles.loreSide}>
        <div><span className={styles.eyebrow}>BAKERY GUILD</span><h2>반죽 장인 고양이들</h2></div>
        <ul className={styles.staff}>{staff.map(([name, role, icon, description]) => <li key={name}><span>{icon}</span><div><b>{name} <small>{role}</small></b><p>{description}</p></div></li>)}</ul>
        <details className={styles.rules}><summary>🐾 빵집의 비밀 규칙</summary><p>인간 손님은 츄르 결제가 불가능합니다.</p><p>빵에서 고양이 털이 발견된다면 그것은 행운의 마법 주문입니다.</p></details>
      </div>
    </section>
  );
}
