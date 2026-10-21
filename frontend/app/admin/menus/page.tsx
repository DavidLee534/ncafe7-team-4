// 메뉴 목록 — 데이터를 준비해서 화면 조각에 나눠 준다. 조각은 받은 값을 보여주기만 한다.
// 필터는 주소의 쿼리(?category=1&status=on&keyword=라떼)로 받아 백엔드 검색 조건으로 넘긴다.
// 거르기·세기·정렬은 백엔드가 하고, 페이지는 필요한 만큼만 받아 나눠 준다.
//   상단 개수·모카 메시지 → summary (카테고리를 골랐으면 그 카테고리 summary)
//   카테고리 칩 → menus/categories, 사장 추천 → ?ownerRecommended=true, 최근 수정 → ?sort=updatedAt&size=5
import { getMenuCategories, getMenus, getMenuSummary } from "@/lib/adminApi";
import { mokaReport } from "@/lib/cat";
import { MENU_STATUS } from "@/lib/format";
import type { MenuStatus } from "@/lib/types";
import MenuListRecent from "./_components/MenuListRecent";
import MenuListEmpty from "./_components/MenuListEmpty";
import MenuListFilters from "./_components/MenuListFilters";
import MenuListSummary from "./_components/MenuListSummary";
import MenuListHero from "./_components/MenuListHero";
import MokaMessage from "../../_components/MokaMessage";
import RecipeBook from "../../_components/RecipeBook";
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
  const categoryId = Number(category) || undefined;
  const [categories, counts, categoryCounts, menus, recommendedMenus, recentMenus] = await Promise.all([
    getMenuCategories(),
    getMenuSummary(),
    categoryId ? getMenuSummary(categoryId) : undefined,
    getMenus({
      categoryId,
      status: status in MENU_STATUS ? (status as MenuStatus) : undefined,
      keyword,
    }),
    getMenus({ ownerRecommended: true }),
    getMenus({ sort: "updatedAt", size: 5 }),
  ]);
  const selectedCategory = categories.find((item) => item.id === categoryId);
  const report =
    selectedCategory && categoryCounts
      ? mokaReport(categoryCounts, selectedCategory.name)
      : mokaReport(counts);

  // 3. 배치
  return (
    <>
      <MenuListHero />
      <MenuListSummary counts={counts} />
      <MenuListFilters
        categories={categories}
        totalCount={counts.all}
        category={category}
        status={status}
        keyword={keyword}
        menuCount={menus.length}
        recommendedMenus={recommendedMenus}
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
        <MenuListRecent menus={recentMenus} />
      </div>
    </>
  );
}
