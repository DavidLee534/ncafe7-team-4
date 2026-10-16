import type { Menu } from "@/lib/types";
import MenuCatalogCard from "./MenuCatalogCard";
import styles from "./MenuCatalog.module.css";

type Props = {
  menus: Menu[]; // 사장 추천 메뉴
  categoryNames: Record<number, string>; // 카테고리 id → 이름 (카드 위쪽 분류 표시)
};

// 사장 추천 메뉴 — 카테고리 칩 위에 추천 메뉴를 메뉴 카드(MenuCatalogCard) 모양으로 모아 보여준다.
// 추천 지정은 메뉴 등록 · 수정 폼의 "사장 추천 메뉴로 표시"에서 한다.
export default function RecommendShelf({ menus, categoryNames }: Props) {
  return (
    <section className={styles.recommendShelf} aria-labelledby="recommend-title">
      <div className={styles.recommendHead}>
        <span aria-hidden="true">🐾</span>
        <div>
          <b id="recommend-title">사장 추천 메뉴 {menus.length}</b>
          <small>모카 점장이 오늘 권하는 메뉴예요. 추천은 메뉴 수정에서 바꿀 수 있어요.</small>
        </div>
      </div>

      {menus.length > 0 ? (
        <ul className={styles.grid}>
          {menus.map((menu) => (
            <MenuCatalogCard
              key={menu.id}
              menu={menu}
              categoryName={categoryNames[menu.categoryId] ?? "-"}
              showActions={false}
            />
          ))}
        </ul>
      ) : (
        <p className={styles.recommendEmpty}>
          아직 추천 메뉴가 없어요. 메뉴 수정에서 &lsquo;사장 추천 메뉴로 표시&rsquo;를 켜 보세요.
        </p>
      )}
    </section>
  );
}
