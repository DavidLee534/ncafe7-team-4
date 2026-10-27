// 레시피 도감 — 내가 빚은 포션과 비밀 레시피. 데이터는 백엔드(/api/v1/my/...)에서 받는다.
// 탭과 고른 칸은 주소의 쿼리(?tab=secret&id=2)로 받아서 처음 화면을 정한다.
import type { Metadata } from "next";
import RecipeCodex, { type CodexTab } from "./_components/RecipeCodex";
import { getMyCodexSummary, getMyRecipes, getMySecretRecipes } from "@/lib/myApi";

export const metadata: Metadata = { title: "레시피 도감" };

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function RecipeCodexPage(props: PageProps<"/my/recipes">) {
  const searchParams = await props.searchParams;
  const tab: CodexTab = one(searchParams.tab) === "secret" ? "secret" : "basic";
  const id = Number(one(searchParams.id)) || undefined;

  const [recipes, secrets, summary] = await Promise.all([getMyRecipes(), getMySecretRecipes(), getMyCodexSummary()]);

  return <RecipeCodex recipes={recipes} secrets={secrets} summary={summary} initialTab={tab} initialId={id} />;
}
