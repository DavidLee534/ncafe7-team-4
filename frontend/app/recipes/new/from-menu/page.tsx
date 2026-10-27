// 기본 메뉴 고르기 — 추가 재료 없이 공방의 기본 메뉴를 골라 바로 장바구니에 담는다.
// 계열은 주소의 쿼리(?category=1)로 받아 백엔드 조건으로 넘긴다. 칩의 메뉴 수는 전체 목록에서 센다.
import type { Metadata } from "next";
import Link from "next/link";
import { getRecipeMenus } from "@/lib/userApi";
import UserHeader from "../../../_components/UserHeader";
import CatalogCard from "../../../_components/CatalogCard";
import RecipeHero from "../_components/RecipeHero";
import AddToCartButton from "../../../_components/AddToCartButton";
import catalog from "../../../_components/Catalog.module.css";

export const metadata: Metadata = { title: "기본 메뉴 고르기" };

export default async function FromMenuPage(props: PageProps<"/recipes/new/from-menu">) {
  // 1. 주소의 조건
  const { category } = await props.searchParams;
  const categoryId = typeof category === "string" ? Number(category) || undefined : undefined;

  // 2. 화면에 필요한 데이터
  const [allMenus, menus] = await Promise.all([getRecipeMenus(), categoryId ? getRecipeMenus(categoryId) : undefined]);
  const shown = menus ?? allMenus;
  const categories = [
    ...new Map(allMenus.filter((menu) => menu.categoryId !== null).map((menu) => [menu.categoryId!, menu.categoryName ?? ""])),
  ].map(([id, name]) => ({ id, name, count: allMenus.filter((menu) => menu.categoryId === id).length }));
  const chipClass = (active: boolean) => `${catalog.categoryChip} ${active ? catalog.categoryChipActive : ""}`;

  // 3. 배치
  return (
    <>
      <UserHeader />
      <main className={catalog.page}>
        <RecipeHero
          mode="menu"
          title={
            <>
              고민될 땐
              <br />
              <em>공방의 기본 메뉴</em>
            </>
          }
          description="추가 재료 없이 기반 재료만으로 빚은 공방의 기본 메뉴예요. 마음에 드는 메뉴를 골라 바로 장바구니에 담아 보세요."
        />
        <div className={catalog.content}>
          {/* 소개 영역 위로 살짝 겹쳐 올린다 */}
          <section className={catalog.controlPanel} style={{ position: "relative", zIndex: 2, marginTop: "-3.8rem" }} aria-labelledby="catalog-title">
            <div className={catalog.panelHeading}>
              <div>
                <span className={catalog.eyebrow}>PAW-APPROVED CATALOG</span>
                <h2 id="catalog-title">모카가 고른 기본 메뉴</h2>
              </div>
              <p>
                <strong>{shown.length}</strong>개의 메뉴가 있어요.
              </p>
            </div>
            <nav className={catalog.categoryRail} aria-label="계열 필터">
              <Link href="/recipes/new/from-menu" className={chipClass(!categoryId)}>
                전체 <span>{allMenus.length}</span>
              </Link>
              {categories.map((item) => (
                <Link key={item.id} href={`/recipes/new/from-menu?category=${item.id}`} className={chipClass(item.id === categoryId)}>
                  {item.name} <span>{item.count}</span>
                </Link>
              ))}
            </nav>
          </section>

          <div className={catalog.layout}>
            <section aria-label="기본 메뉴 목록">
              {shown.length === 0 ? (
                <div className={catalog.empty}>
                  <span aria-hidden="true">☕</span>
                  <h3>이 계열에는 아직 메뉴가 없어요.</h3>
                  <p>다른 계열을 골라 보세요.</p>
                  <Link href="/recipes/new/from-menu">전체 메뉴 보기</Link>
                </div>
              ) : (
                <ul className={catalog.grid}>
                  {shown.map((menu) => (
                    <CatalogCard
                      key={menu.menuId}
                      id={menu.menuId}
                      name={menu.korName}
                      engName={menu.engName}
                      categoryName={menu.categoryName}
                      price={menu.price}
                      imageUrl={menu.imageUrl}
                      showArt={false}
                      badge={menu.status === "on" ? { label: "판매 중", color: "success" } : { label: "품절", color: "warning" }}
                      tags={menu.emotionTags}
                    >
                      <Link href={`/recipes/new?menuId=${menu.menuId}`} className="m3-btn btn:text btn-size:xs">
                        ⚗️ 조합하기
                      </Link>
                      <AddToCartButton
                        name={menu.korName}
                        options={[menu.engName]}
                        unitPrice={menu.price}
                        disabled={menu.status !== "on"}
                        disabledLabel="품절"
                      />
                    </CatalogCard>
                  ))}
                </ul>
              )}
            </section>

            <aside className={catalog.diary} aria-labelledby="guide-title">
              <div className={catalog.diaryHeader}>
                <span aria-hidden="true">🐈</span>
                <div>
                  <span className={catalog.eyebrow}>MANAGER&apos;S NOTE</span>
                  <h2 id="guide-title" className={catalog.diaryTitle}>
                    모카 점장의 메모
                  </h2>
                </div>
              </div>
              <p className={catalog.diaryLead}>“기본 메뉴도 충분히 마법 같다냥. 그래도 심심하면 재료를 더해 봐!”</p>
              <ul className={catalog.log}>
                <li>
                  <span className={catalog.logDate}>담기</span>
                  <span className={catalog.logName}>🛒 바로 장바구니로</span>
                  <span className={catalog.logText}>같은 메뉴를 또 담으면 수량이 늘어나요.</span>
                </li>
                <li>
                  <span className={catalog.logDate}>조합하기</span>
                  <span className={catalog.logName}>⚗️ 이 메뉴를 기반으로</span>
                  <span className={catalog.logText}>재료로 만들기에서 추가 재료를 더해요.</span>
                </li>
                <li>
                  <span className={catalog.logDate}>모르겠다면</span>
                  <Link href="/recipes/new/emotion" className={catalog.logName}>
                    💗 감정으로 처방 받기
                  </Link>
                  <span className={catalog.logText}>지금 기분에 맞는 메뉴를 골라 줘요.</span>
                </li>
              </ul>
              <p className={catalog.quote}>
                오늘의 임무: 맛있는 메뉴를 고르고
                <br />
                꼬리를 흔들며 기다리기 🐾
              </p>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
