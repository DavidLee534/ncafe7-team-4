import Link from "next/link";
import CatDiary from "../_components/CatDiary";
import MokaMessage from "../_components/MokaMessage";
import MagicLore from "../_components/MagicLore";
import RecipeBook from "../../../menu/_components/RecipeBook";
import { countMenusByStatus, getCategories, getMenus } from "@/lib/mock";
import { MENU_STATUS } from "@/lib/format";
import styles from "../_components/MenuCatalog.module.css";
import type { MenuStatus } from "@/lib/types";

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AdminMenuListPage(props: PageProps<"/admin/menus/list">) {
  const searchParams = await props.searchParams;
  const category = one(searchParams.category);
  const status = one(searchParams.status);
  const keyword = one(searchParams.keyword);
  const categories = getCategories();
  const counts = countMenusByStatus();
  const selectedCategory = categories.find((item) => String(item.id) === category);
  const selectedCategoryMenus = selectedCategory ? getMenus({ categoryId: selectedCategory.id }) : getMenus();
  const soldoutCount = selectedCategoryMenus.filter((item) => item.status === "soldout").length;
  const availableCount = selectedCategoryMenus.filter((item) => item.status === "on").length;
  const managerMessage = selectedCategory
    ? `${selectedCategory.name} 책장에는 판매 가능한 주문이 ${availableCount}개, 품절 메뉴가 ${soldoutCount}개 있다냥.`
    : `오늘 공방에는 판매 가능한 주문이 ${counts.on}개, 품절 메뉴가 ${counts.soldout}개 있다냥. 어떤 레시피책을 펼쳐 볼까냥?`;
  const menus = getMenus({
    categoryId: Number(category) || undefined,
    status: status in MENU_STATUS ? (status as MenuStatus) : undefined,
    keyword,
  });

  const overview = [
    { label: "전체 메뉴", value: counts.all, tone: "neutral" },
    { label: "판매 가능", value: counts.on, tone: "success" },
    { label: "일시 품절", value: counts.soldout, tone: "warning" },
    { label: "비공개", value: counts.hidden, tone: "muted" },
  ];

  return (
    <>
      <section className={styles.storyHero}>
        <div className={styles.storyGlow} aria-hidden="true" />
        <div className={styles.storyCopy}>
          <span className={styles.storyKicker}>🌙 MIDNIGHT ONLY · CAT WIZARD BAKERY</span>
          <h1>냥이 발자국 빵집<br /><em>비밀 메뉴 공방</em></h1>
          <p>인간들이 잠든 밤, 고양이 마법사들이 젤리 반죽을 꾹꾹 눌러 달콤한 주문을 굽습니다.</p>
          <div className={styles.storyActions}>
            <Link href="/admin/menus/create" className="m3-btn btn-size:md btn-icon:leading">
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

      <section className={`${styles.overview} ${styles.storyOverlap}`} aria-label="메뉴 운영 현황">
        <div className={styles.overviewIntro}>
          <span className={styles.mascotFace} aria-hidden="true">🐱</span>
          <span className={styles.eyebrow}>MOKA’S CHECK-IN</span>
          <p>점장 모카의 아침 점검</p>
          <span>발바닥 도장으로 오늘의 메뉴 상태를 확인해요.</span>
        </div>
        <ul className={styles.metrics}>
          {overview.map((item) => (
            <li key={item.label} className={`${styles.metric} ${styles[`metric${item.tone}`]}`}>
              <span className={styles.metricPaw} aria-hidden="true">{item.tone === "success" ? "🐾" : item.tone === "warning" ? "🐟" : item.tone === "muted" ? "💤" : "✦"}</span>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>개</small>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.controlPanel} aria-labelledby="catalog-title">
        <div className={styles.panelHeading}>
          <div>
            <span className={styles.eyebrow}>PAW-APPROVED CATALOG</span>
            <h2 id="catalog-title">모카가 고른 메뉴</h2>
          </div>
          <p>
            <strong>{menus.length}</strong>개의 메뉴가 선택한 조건에 맞습니다.
          </p>
        </div>

        <div className={styles.signatureShelf} aria-label="시그니처 메뉴 안내">
          <div className={styles.signatureTitle}>
            <span aria-hidden="true">🪄</span>
            <div><b>비밀 레시피 보관함</b><small>밤의 공방에서만 구울 수 있어요</small></div>
          </div>
          <div className={styles.signatureMenu}>
            <span aria-hidden="true">🧃</span>
            <div><b>츄르 에이드</b><small>반짝이는 과일 젤리와 탄산의 마법</small></div>
          </div>
          <div className={styles.signatureMenu}>
            <span aria-hidden="true">🐟</span>
            <div><b>생선 구이 맛 쿠키</b><small>사실은 달콤한 붕어빵 맛 디저트</small></div>
          </div>
        </div>

        <nav className={styles.categoryRail} aria-label="카테고리 빠른 필터">
          <Link href="/admin/menus/list" className={`${styles.categoryChip} ${!category ? styles.categoryChipActive : ""}`}>
            전체
            <span>{counts.all}</span>
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/admin/menus/list?category=${item.id}`}
              className={`${styles.categoryChip} ${String(item.id) === category ? styles.categoryChipActive : ""}`}
            >
              {item.name}
              <span>{getMenus({ categoryId: item.id }).length}</span>
            </Link>
          ))}
        </nav>

        <form className={styles.filterBar} role="search" aria-label="메뉴 검색 및 필터">
          <label className={styles.searchField}>
            <i className="m3-icon icon:search" aria-hidden="true" />
            <input type="search" name="keyword" defaultValue={keyword} placeholder="메뉴명으로 검색" />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">판매 상태</span>
            <select name="status" defaultValue={status} aria-label="판매 상태">
              <option value="">전체 상태</option>
              {Object.entries(MENU_STATUS).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {category && <input type="hidden" name="category" value={category} />}
          <button type="submit" className="m3-btn btn:outlined">
            적용
          </button>
          {(category || status || keyword) && (
            <Link href="/admin/menus/list" className={styles.resetLink}>
              필터 초기화
            </Link>
          )}
        </form>
      </section>

      <MokaMessage message={managerMessage} />

      <div className={styles.layout}>
        <section aria-label="메뉴 레시피북">
          {menus.length === 0 ? (
            <div className={styles.empty}>
              <span aria-hidden="true">☕</span>
              <h3>조건에 맞는 메뉴가 없어요.</h3>
              <p>검색어나 필터를 바꿔 보거나, 새 메뉴를 등록해 보세요.</p>
              <Link href="/admin/menus/list">전체 메뉴 보기</Link>
            </div>
          ) : (
            <RecipeBook
              key={`${category || "all"}-${status}-${keyword}`}
              menus={menus}
              admin
              overview={!category}
              categoryId={Number(category) || undefined}
            />
          )}
        </section>

        <CatDiary menus={getMenus()} />
      </div>
      <MagicLore />
    </>
  );
}
