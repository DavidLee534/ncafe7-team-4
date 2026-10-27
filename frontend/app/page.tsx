import Link from "next/link";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return <main className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.brand}><span>🐱</span><b>nyan cafe</b></Link><details className={styles.story}><summary>✦ 공방 이야기</summary><section><span>MOONLIGHT WORKSHOP</span><h2>모카 점장의 비밀 공방</h2><p>숲속 오래된 탑 1층에서는, 은퇴한 대연금술사 모카가 밤마다 달콤한 포션을 빚고 있어요.</p><p>기반 재료 하나에 마음에 드는 촉매를 더하면 나만의 주문이 완성됩니다냥.</p></section></details></header>
    <section className={styles.hero}><span>🌙 MIDNIGHT ONLY · CAT ALCHEMY CAFE</span><h1>오늘 밤, 어떤<br/><em>포션을 빚어볼까요?</em></h1><p>달빛이 켜지면 문을 여는 고양이 연금술 공방. 모카 점장의 메뉴 책장을 펼치거나, 나만의 레시피를 만들어 보세요.</p><div><Link href="/menus" className={styles.primary}>비밀 메뉴 책장 열기</Link><Link href="/recipes/new" className={styles.secondary}>🪄 포션 조합하기</Link></div></section><div className={styles.cat} aria-hidden="true">🐈‍⬛</div>
  </main>;
}
