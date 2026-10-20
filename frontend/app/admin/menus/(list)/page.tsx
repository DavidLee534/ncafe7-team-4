// 메뉴 목록 — 데이터를 준비해서 화면 조각에 나눠 준다. 조각은 받은 값을 보여주기만 한다.
// 필터는 주소의 쿼리(?category=1&status=on&keyword=라떼)로 받는다. 데이터는 목업.
import {
  countMenusByCategory,
  countMenusByStatus,
  getCategories,
  getMenus,
} from "@/lib/mock";
import { mokaReport } from "@/lib/cat";
import { MENU_STATUS } from "@/lib/format";
import type { MenuStatus } from "@/lib/types";
import CatDiary from "./_components/CatDiary";
import EmptyMenus from "./_components/EmptyMenus";
import MenuCatalogFilters from "./_components/MenuCatalogFilters";
import MenuStatusOverview from "./_components/MenuStatusOverview";
import MenuStoryHero from "./_components/MenuStoryHero";
import MokaMessage from "../../../_components/MokaMessage";
import RecipeBook from "../../../_components/RecipeBook";
import styles from "./_components/MenuCatalog.module.css";

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AdminMenuListPage(
  props: PageProps<"/admin/menus">,
) {
  // 1. 주소의 검색 조건
  const searchParams = await props.searchParams;
  const category = one(searchParams.category);
  const status = one(searchParams.status);
  const keyword = one(searchParams.keyword);

  // 2. 화면에 필요한 데이터
  const categories = getCategories();
  const counts = countMenusByStatus();
  const menuCounts = Object.fromEntries(
    categories.map((item) => [item.id, countMenusByCategory(item.id)]),
  );
  const selectedCategory = categories.find(
    (item) => String(item.id) === category,
  );
  const allMenus = getMenus();
  const menus = getMenus({
    categoryId: Number(category) || undefined,
    status: status in MENU_STATUS ? (status as MenuStatus) : undefined,
    keyword,
  });
  const recommendedMenus = allMenus.filter((item) => item.isRecommended);
  const categoryNames = Object.fromEntries(categories.map((item) => [item.id, item.name]));
  const report = selectedCategory
    ? mokaReport(
        getMenus({ categoryId: selectedCategory.id }),
        selectedCategory.name,
      )
    : mokaReport(allMenus);

  // 3. 배치
  return (
    <>
      <MenuStoryHero />
      <MenuStatusOverview counts={counts} />
      <MenuCatalogFilters
        categories={categories}
        totalCount={counts.all}
        menuCounts={menuCounts}
        category={category}
        status={status}
        keyword={keyword}
        menuCount={menus.length}
        recommendedMenus={recommendedMenus}
        categoryNames={categoryNames}
      />
      <MokaMessage message={report} />
      <div className={styles.layout}>
        <section aria-label="메뉴 레시피북">
          {menus.length === 0 ? (
            <EmptyMenus />
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
        <CatDiary menus={allMenus} />
      </div>
    </>
  );
}
