// 메뉴 상세 — 소개 영역(이름 · 상태 · 담기) · 기본 정보 · 메뉴 그림 · 같은 카테고리의 다른 메뉴 (관리자 메뉴 상세와 같은 구성).
// 없거나 숨긴 메뉴면 404.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMenuBySlug, getMenus } from "@/lib/userApi";
import { pawCode } from "@/lib/cat";
import { won } from "@/lib/format";
import UserHeader from "../../_components/UserHeader";
import CatalogHero from "../../_components/CatalogHero";
import CatalogCard from "../../_components/CatalogCard";
import AddToCartButton from "../../_components/AddToCartButton";
import catalog from "../../_components/Catalog.module.css";

export async function generateMetadata(props: PageProps<"/menus/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  return { title: menu?.korName ?? "메뉴" };
}

export default async function MenuDetailPage(props: PageProps<"/menus/[slug]">) {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  if (!menu) notFound();
  const siblings = (await getMenus({ categoryId: menu.categoryId })).filter((item) => item.id !== menu.id);
  const soldOut = menu.status !== "on";

  return (
    <>
      <UserHeader />
      <main className={catalog.page}>
        <CatalogHero
          image="/images/hero/moka-secret-bakery.png"
          kicker={`🌙 ${menu.categoryName.toUpperCase()} · ${pawCode(menu.id)}`}
          title={
            <>
              {menu.korName}
              <br />
              <em>{won(menu.price)}</em>
            </>
          }
          description={menu.description || `${menu.engName} — 모카 점장이 정성껏 준비한 메뉴예요.`}
          actions={
            <>
              <AddToCartButton name={menu.korName} menuId={menu.id} disabled={soldOut} disabledLabel="지금은 품절이에요" />
              <Link href={`/recipes/new?menuId=${menu.id}`} className="m3-btn btn:outlined btn-size:md">
                ⚗️ 이 메뉴로 포션 만들기
              </Link>
              <Link href="/menus" className="m3-btn btn:outlined btn-size:md">
                ← 메뉴 책장
              </Link>
            </>
          }
        />

        <div className={catalog.content}>
          <div className={catalog.detailGrid} style={{ position: "relative", zIndex: 2, marginTop: "-3.8rem" }}>
            <section className={catalog.controlPanel} style={{ margin: 0 }} aria-labelledby="info-title">
              <div className={catalog.panelHeading}>
                <div>
                  <span className={catalog.eyebrow}>MENU CARD</span>
                  <h2 id="info-title">기본 정보</h2>
                </div>
                <span className={`m3-badge badge:inline badge-color:${soldOut ? "warning" : "success"}`}>{soldOut ? "품절" : "판매 중"}</span>
              </div>
              <dl className={catalog.facts}>
                <div>
                  <dt>메뉴명</dt>
                  <dd>{menu.korName}</dd>
                </div>
                <div>
                  <dt>영문</dt>
                  <dd>{menu.engName}</dd>
                </div>
                <div>
                  <dt>카테고리</dt>
                  <dd>
                    <Link href={`/menus?category=${menu.categoryId}`}>{menu.categoryName}</Link>
                  </dd>
                </div>
                <div>
                  <dt>가격</dt>
                  <dd>{won(menu.price)}</dd>
                </div>
                <div className={catalog.factWide}>
                  <dt>설명</dt>
                  <dd>{menu.description || "-"}</dd>
                </div>
                <div>
                  <dt>어울리는 기분</dt>
                  <dd>{menu.emotionTags.length ? menu.emotionTags.join(", ") : "-"}</dd>
                </div>
                <div>
                  <dt>맛</dt>
                  <dd>{menu.tasteTags.length ? menu.tasteTags.join(", ") : "-"}</dd>
                </div>
              </dl>
              {soldOut && <p className={`${catalog.hint}`}>지금은 품절이라 담을 수 없어요. 곧 다시 구워 둘게요냥.</p>}
            </section>

            <aside className={`${catalog.diary} ${catalog.detailImageCard}`} aria-label="메뉴 그림">
              <div className={catalog.detailArt}>
                {menu.imageUrl ? <img src={menu.imageUrl} alt={menu.korName} /> : <span aria-hidden="true">☕</span>}
              </div>
              <p className={catalog.quote} style={{ marginTop: "1rem" }}>
                오늘의 임무: 맛있게 먹고
                <br />
                꼬리를 흔들기 🐾
              </p>
            </aside>
          </div>

          {siblings.length > 0 && (
            <section className={catalog.controlPanel} aria-labelledby="sibling-title">
              <div className={catalog.panelHeading}>
                <div>
                  <span className={catalog.eyebrow}>SAME SHELF</span>
                  <h2 id="sibling-title">{menu.categoryName}의 다른 메뉴</h2>
                </div>
                <p>
                  <strong>{siblings.length}</strong>개 더 있어요.
                </p>
              </div>
              <ul className={catalog.grid} style={{ marginTop: "1rem" }}>
                {siblings.map((item) => (
                  <CatalogCard
                    key={item.id}
                    id={item.id}
                    name={item.korName}
                    engName={item.engName}
                    categoryName={item.categoryName}
                    price={item.price}
                    imageUrl={item.imageUrl}
                    href={`/menus/${item.slug}`}
                    badge={item.status === "on" ? { label: "판매 중", color: "success" } : { label: "품절", color: "warning" }}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
