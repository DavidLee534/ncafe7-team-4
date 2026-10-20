// 메뉴 목록 — 데이터를 준비해서 화면 조각에 나눠 준다. 조각은 받은 값을 보여주기만 한다.
// 필터는 주소의 쿼리(?category=1&status=on&keyword=라떼)로 받는다. 데이터는 백엔드에서 받는다.
import { countMenusByStatus, filterMenus, getCategories, getMenus } from "@/lib/adminApi";
import { mokaReport } from "@/lib/cat";
import { MENU_STATUS } from "@/lib/format";
import type { MenuStatus } from "@/lib/types";
import MenuListRecent from "./_components/MenuListRecent";
import MenuListEmpty from "./_components/MenuListEmpty";
import MenuListFilters from "./_components/MenuListFilters";
import MenuListSummary from "./_components/MenuListSummary";
import MenuListHero from "./_components/MenuListHero";
import MokaMessage from "../../../_components/MokaMessage";
import RecipeBook from "../../../_components/RecipeBook";
import styles from "./_components/MenuList.module.css";

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
  const [categories, allMenus] = await Promise.all([getCategories(), getMenus()]);
  const counts = countMenusByStatus(allMenus);
  const menuCounts = Object.fromEntries(
    categories.map((item) => [item.id, item.menuCount]),
  );
  const selectedCategory = categories.find(
    (item) => String(item.id) === category,
  );
  const menus = filterMenus(allMenus, {
    categoryId: Number(category) || undefined,
    status: status in MENU_STATUS ? (status as MenuStatus) : undefined,
    keyword,
  });
  const recommendedMenus = allMenus.filter((item) => item.isRecommended);
  const categoryNames = Object.fromEntries(categories.map((item) => [item.id, item.name]));
  const report = selectedCategory
    ? mokaReport(
        filterMenus(allMenus, { categoryId: selectedCategory.id }),
        selectedCategory.name,
      )
    : mokaReport(allMenus);

  // 3. 배치
  return (
    <>
      <MenuListHero />
      <MenuListSummary counts={counts} />
      <MenuListFilters
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
            <MenuListEmpty />
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
        <MenuListRecent menus={allMenus} />
      </div>
    </>
  );
}
