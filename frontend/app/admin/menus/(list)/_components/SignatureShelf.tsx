import styles from "./MenuCatalog.module.css";

// 비밀 레시피 보관함 — 시그니처 메뉴 안내 (고정 문구)
const signatures = [
  { icon: "🧃", name: "츄르 에이드", note: "반짝이는 과일 젤리와 탄산의 마법" },
  { icon: "🐟", name: "생선 구이 맛 쿠키", note: "사실은 달콤한 붕어빵 맛 디저트" },
];

export default function SignatureShelf() {
  return (
    <div className={styles.signatureShelf} aria-label="시그니처 메뉴 안내">
      <div className={styles.signatureTitle}>
        <span aria-hidden="true">🪄</span>
        <div>
          <b>비밀 레시피 보관함</b>
          <small>밤의 공방에서만 구울 수 있어요</small>
        </div>
      </div>
      {signatures.map((item) => (
        <div key={item.name} className={styles.signatureMenu}>
          <span aria-hidden="true">{item.icon}</span>
          <div>
            <b>{item.name}</b>
            <small>{item.note}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
