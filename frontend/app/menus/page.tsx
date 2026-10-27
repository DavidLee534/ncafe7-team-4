// 메뉴 목록 — 손님 메뉴판. 데이터를 준비해서 배치만 한다 (관리자 메뉴 목록과 같은 구성).
// 조건은 주소의 쿼리(?category=1&keyword=라떼)로 받아 백엔드 검색 조건으로 넘긴다.
//   카테고리 칩 → menus/categories, 사장 추천 → menus/recommendations, 목록 → menus?categoryId=&keyword=
import type { Metadata } from "next";
import Link from "next/link";
import {
  getMenuCategories,
  getMenuRecommendations,
  getMenus,
  type PublicMenu,
} from "@/lib/userApi";
import UserHeader from "../_components/UserHeader";
import CatalogHero from "../_components/CatalogHero";
import CatalogCard from "../_components/CatalogCard";
import AddToCartButton from "../_components/AddToCartButton";
import RecipeBook from "../_components/RecipeBook";
import type { Menu } from "@/lib/types";
import catalog from "../_components/Catalog.module.css";

export const metadata: Metadata = { title: "메뉴 책장" };

// 소개 영역 위로 살짝 겹쳐 올리는 첫 덩어리
const overlap = {
  position: "relative",
  zIndex: 2,
  marginTop: "-3.8rem",
} as const;

// 메뉴책(RecipeBook)은 관리자 화면과 같이 쓰는 컴포넌트라 화면용 Menu 모양으로 바꿔 넘긴다
function toBookMenu(menu: PublicMenu): Menu {
  return {
    id: menu.id,
    korName: menu.korName,
    engName: menu.engName,
    categoryId: menu.categoryId,
    categoryName: menu.categoryName,
    slug: menu.slug,
    price: menu.price,
    description: "",
    image: menu.imageUrl,
    status: menu.status,
    isNew: false,
    isSecret: false,
    isRecommended: false,
    createdAt: "",
    updatedAt: "",
  };
}

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

// 사장 추천 메뉴 카드 한 장 — 상세로 가는 링크와 담기 버튼 (품절이면 담기를 막는다)
function MenuCard({ menu }: { menu: PublicMenu }) {
  return (
    <CatalogCard
      id={menu.id}
      name={menu.korName}
      engName={menu.engName}
      categoryName={menu.categoryName}
      price={menu.price}
      imageUrl={menu.imageUrl}
      href={`/menus/${menu.slug}`}
      badge={
        menu.status === "on"
          ? { label: "판매 중", color: "success" }
          : { label: "품절", color: "warning" }
      }
    >
      <Link
        href={`/menus/${menu.slug}`}
        className="m3-btn btn:text btn-size:xs"
      >
        자세히
      </Link>
      <AddToCartButton
        name={menu.korName}
        options={[menu.engName]}
        unitPrice={menu.price}
        disabled={menu.status !== "on"}
        disabledLabel="품절"
      />
    </CatalogCard>
  );
}

export default async function MenuListPage(props: PageProps<"/menus">) {
  // 1. 주소의 검색 조건
  const searchParams = await props.searchParams;
  const category = one(searchParams.category);
  const keyword = one(searchParams.keyword);
  const categoryId = Number(category) || undefined;

  // 2. 화면에 필요한 데이터
  const [categories, recommended, allMenus, menus] = await Promise.all([
    getMenuCategories(),
    getMenuRecommendations(),
    getMenus(),
    categoryId || keyword ? getMenus({ categoryId, keyword }) : undefined,
  ]);
  const shown = menus ?? allMenus;
  const chipClass = (active: boolean) =>
    `${catalog.categoryChip} ${active ? catalog.categoryChipActive : ""}`;

  // 3. 배치
  return (
    <>
      <UserHeader />
      <main className={catalog.page}>
        <CatalogHero
          image="/images/hero/moka-secret-bakery.png"
          kicker="🌙 MIDNIGHT ONLY · CAT WIZARD BAKERY"
          title={
            <>
              모카 점장의
              <br />
              <em>비밀 메뉴 책장</em>
            </>
          }
          description="인간들이 잠든 밤, 고양이 마법사들이 구운 메뉴를 골라 보세요. 나만의 포션을 만들고 싶다면 연금 공방으로 놀러 와요냥."
          notes={["✨ 별가루 오븐 예열 완료", "🫧 젤리 반죽 발효 중"]}
          actions={
            <>
              <Link href="/recipes/new" className="m3-btn btn-size:md">
                ⚗️ 나만의 포션 만들기
              </Link>
              <Link
                href="/recipes/new/emotion"
                className="m3-btn btn:outlined btn-size:md"
              >
                💗 기분으로 고르기
              </Link>
            </>
          }
        />
        <div className={catalog.content}>
          {/* 모카가 고른 메뉴(사장 추천) — 소개 영역 위로 살짝 겹쳐 올린다 */}
          {recommended.length > 0 && (
            <section
              className={catalog.controlPanel}
              style={overlap}
              aria-labelledby="catalog-title"
            >
              <div className={catalog.panelHeading}>
                <div>
                  <span className={catalog.eyebrow}>PAW-APPROVED CATALOG</span>
                  <h2 id="catalog-title">모카가 고른 메뉴</h2>
                </div>
                <p>
                  사장 추천 <strong>{recommended.length}</strong>개
                </p>
              </div>
              <section
                className={catalog.recommendShelf}
                aria-labelledby="recommend-title"
              >
                <div className={catalog.recommendHead}>
                  <span aria-hidden="true">🐾</span>
                  <div>
                    <b id="recommend-title">
                      사장 추천 메뉴 {recommended.length}
                    </b>
                    <small>모카 점장이 오늘 권하는 메뉴예요.</small>
                  </div>
                </div>
                <ul className={catalog.grid}>
                  {recommended.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                  ))}
                </ul>
              </section>
            </section>
          )}

          {/* 카테고리 분류 · 검색. 추천 메뉴가 없으면 이 패널이 소개 영역에 겹친다 */}
          <section
            className={catalog.controlPanel}
            style={recommended.length > 0 ? undefined : overlap}
            aria-labelledby="find-title"
          >
            <div className={catalog.panelHeading}>
              <div>
                <span className={catalog.eyebrow}>FIND YOUR MENU</span>
                <h2 id="find-title">메뉴 찾기</h2>
              </div>
              <p>
                <strong>{shown.length}</strong>개의 메뉴가{" "}
                {categoryId || keyword ? "조건에 맞아요." : "있어요."}
              </p>
            </div>

            <nav className={catalog.categoryRail} aria-label="카테고리 필터">
              <Link
                href={
                  keyword
                    ? `/menus?keyword=${encodeURIComponent(keyword)}`
                    : "/menus"
                }
                className={chipClass(!categoryId)}
              >
                전체 <span>{allMenus.length}</span>
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.id}
                  href={`/menus?category=${item.id}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}`}
                  className={chipClass(item.id === categoryId)}
                >
                  {item.name} <span>{item.menuCount}</span>
                </Link>
              ))}
            </nav>

            {/* GET 폼이라 조건이 주소의 쿼리로 남는다. 고른 카테고리는 숨은 값으로 함께 보낸다 */}
            <form
              className={catalog.filterBar}
              role="search"
              aria-label="메뉴 검색"
            >
              <label className={catalog.searchField}>
                <i className="m3-icon icon:search" aria-hidden="true" />
                <span className="sr-only">메뉴 이름</span>
                <input
                  type="search"
                  name="keyword"
                  defaultValue={keyword}
                  placeholder="메뉴 이름으로 찾기 (한글 · 영문)"
                />
              </label>
              {categoryId && (
                <input type="hidden" name="category" value={categoryId} />
              )}
              <button type="submit" className="m3-btn btn:outlined">
                찾기
              </button>
              {(categoryId || keyword) && (
                <Link href="/menus" className={catalog.resetLink}>
                  조건 지우기
                </Link>
              )}
            </form>
          </section>

          <section className={catalog.section} aria-label="메뉴 목록">
            {shown.length === 0 ? (
              <div className={catalog.empty}>
                <span aria-hidden="true">☕</span>
                <h3>조건에 맞는 메뉴가 없어요.</h3>
                <p>검색어나 카테고리를 바꿔 보세요.</p>
                <Link href="/menus">전체 메뉴 보기</Link>
              </div>
            ) : (
              // 펼친 메뉴책 — 한 장에 네 가지, "다음 장"을 누르면 책장이 넘어간다. 조건이 바뀌면 첫 장부터
              <RecipeBook
                key={`${categoryId ?? "all"}-${keyword}`}
                menus={shown.map(toBookMenu)}
                overview
                customer
              />
            )}
          </section>
        </div>
      </main>
    </>
  );
}
