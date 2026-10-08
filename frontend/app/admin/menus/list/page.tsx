import Link from "next/link";
import { countMenusByStatus, getCategories, getMenus } from "@/lib/mock";
import { MENU_STATUS } from "@/lib/format";
import type { MenuStatus } from "@/lib/types";
import CatDiary from "../_components/CatDiary";
import MagicLore from "../_components/MagicLore";
import MenuCatalogFilters from "../_components/MenuCatalogFilters";
import MenuStatusOverview from "../_components/MenuStatusOverview";
import MenuStoryHero from "../_components/MenuStoryHero";
import MokaMessage from "../_components/MokaMessage";
import RecipeBook from "../../../menu/_components/RecipeBook";
import styles from "../_components/MenuCatalog.module.css";

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AdminMenuListPage(
  props: PageProps<"/admin/menus/list">,
) {
  const searchParams = await props.searchParams;
  const category = one(searchParams.category);
  const status = one(searchParams.status);
  const keyword = one(searchParams.keyword);
  const categories = getCategories();
  const counts = countMenusByStatus();
  const selectedCategory = categories.find(
    (item) => String(item.id) === category,
  );
  const categoryMenus = selectedCategory
    ? getMenus({ categoryId: selectedCategory.id })
    : getMenus();
  const menus = getMenus({
    categoryId: Number(category) || undefined,
    status: status in MENU_STATUS ? (status as MenuStatus) : undefined,
    keyword,
  });
  const availableCount = categoryMenus.filter(
    (item) => item.status === "on",
  ).length;
  const soldoutCount = categoryMenus.filter(
    (item) => item.status === "soldout",
  ).length;
  const managerMessage = selectedCategory
    ? `${selectedCategory.name} 책장에는 판매 가능한 주문이 ${availableCount}개, 품절 메뉴가 ${soldoutCount}개 있다냥.`
    : `오늘 공방에는 판매 가능한 주문이 ${counts.on}개, 품절 메뉴가 ${counts.soldout}개 있다냥. 어떤 레시피책을 펼쳐 볼까냥?`;

  return (
    <>
      <MenuStoryHero />
      <MenuStatusOverview counts={counts} />
      <MenuCatalogFilters
        categories={categories}
        counts={counts}
        category={category}
        status={status}
        keyword={keyword}
        menuCount={menus.length}
      />
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
