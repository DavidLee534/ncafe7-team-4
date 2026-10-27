// 재료로 레시피 만들기 — 재료 선반을 받아 연금 공방(IngredientWorkshop)에 넘긴다.
// ?menuId=번호 로 오면(메뉴 상세의 "조합하기") 그 메뉴의 필수 재료를 골라 둔다.
import type { Metadata } from "next";
import { getIngredientShelves } from "@/lib/userApi";
import UserHeader from "../../_components/UserHeader";
import RecipeHero from "./_components/RecipeHero";
import IngredientWorkshop from "./_components/IngredientWorkshop";
import catalog from "../../_components/Catalog.module.css";

export const metadata: Metadata = { title: "재료로 레시피 만들기" };

export default async function RecipeNewPage(props: PageProps<"/recipes/new">) {
  const { menuId } = await props.searchParams;
  const initialMenuId = typeof menuId === "string" ? Number(menuId) || undefined : undefined;
  const shelves = await getIngredientShelves();

  return (
    <>
      <UserHeader />
      <main className={catalog.page}>
        <RecipeHero
          mode="material"
          title={
            <>
              재료를 골라
              <br />
              <em>나만의 포션 빚기</em>
            </>
          }
          description="계열을 고르고 필수 재료 하나에 추가 재료를 더해 연금솥에 넣으면, 모카 점장이 세상에 하나뿐인 포션을 완성해 줘요."
        />
        <div className={catalog.content}>
          {/* 소개 영역 위로 살짝 겹쳐 올린다 */}
          <div style={{ position: "relative", zIndex: 2, marginTop: "-3.8rem" }}>
            <IngredientWorkshop key={initialMenuId ?? "new"} shelves={shelves} initialMenuId={initialMenuId} />
          </div>
        </div>
      </main>
    </>
  );
}
