// 감정으로 레시피 만들기 — 감정 · 맛 목록을 받아 EmotionWorkshop 에 넘긴다. 추천은 화면에서 고른 뒤 받는다.
import type { Metadata } from "next";
import { getRecipeEmotions } from "@/lib/userApi";
import UserHeader from "../../../_components/UserHeader";
import RecipeHero from "../_components/RecipeHero";
import EmotionWorkshop from "../_components/EmotionWorkshop";
import catalog from "../../../_components/Catalog.module.css";

export const metadata: Metadata = { title: "감정으로 레시피 만들기" };

export default async function EmotionRecipePage() {
  const { emotions, tastes } = await getRecipeEmotions();

  return (
    <>
      <UserHeader />
      <main className={catalog.page}>
        <RecipeHero
          mode="emotion"
          title={
            <>
              지금 기분으로
              <br />
              <em>모카의 처방 받기</em>
            </>
          }
          description="오늘 뭘 마실지 모르겠을 때, 지금 기분과 끌리는 맛을 알려 주세요. 모카 점장이 어울리는 메뉴를 골라 줘요."
        />
        <div className={catalog.content}>
          {/* 소개 영역 위로 살짝 겹쳐 올린다 */}
          <div style={{ position: "relative", zIndex: 2, marginTop: "-3.8rem" }}>
            <EmotionWorkshop emotions={emotions} tastes={tastes} />
          </div>
        </div>
      </main>
    </>
  );
}
