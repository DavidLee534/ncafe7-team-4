// 회원 화면(/my/...)의 조회 함수 — 백엔드(/api/v1/my/...)에서 받는다.
// 서버 컴포넌트(페이지)에서만 부른다. 브라우저에서 부를 때는 같은 주소(/api/v1/my/...)를 fetch 하면
// next.config 의 rewrites 가 백엔드로 넘긴다. 서버 요청은 현재 로그인 쿠키를 전달한다.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export type PotionGrade = "normal" | "rare" | "legend";

// 내가 빚은 포션 (GET /api/v1/my/recipes)
export type MyRecipe = {
  id: number;
  name: string;
  grade: PotionGrade;
  price: number;
  color: string;
  baseMenuId: number;
  baseMenuName: string;
  secret: boolean; // 비밀 레시피 조합을 맞혀서 만든 포션인지
  createdAt: string;
};

// 내 포션 상세 (GET /api/v1/my/recipes/{id})
export type MyRecipeDetail = Omit<MyRecipe, "secret"> & {
  baseMenuDescription: string | null;
  secretRecipeName: string | null;
  ingredients: string[]; // 넣은 재료 이름 (기반 재료 먼저)
};

// 비밀 레시피 탭 (GET /api/v1/my/secret-recipes). 못 찾은 레시피는 name·description 이 null 이고 riddle 만 있다
export type MySecretRecipe = {
  id: number;
  grade: "rare" | "legend";
  categoryId: number | null;
  categoryName: string | null;
  color: string;
  discovered: boolean;
  discoveredAt: string | null;
  name: string | null;
  description: string | null;
  riddle: string | null;
};

// 비밀 레시피 상세 (GET /api/v1/my/secret-recipes/{id}) — 목록 값 + 이 레시피를 찾은 회원 비율(%) + 재료 조합
// 못 찾은 레시피는 재료 개수(ingredientCount)만 오고 ingredients 는 null
export type MySecretRecipeDetail = MySecretRecipe & {
  customerRate: number;
  ingredientCount: number;
  ingredients: string[] | null;
};

// 도감 상단 숫자 (GET /api/v1/my/recipes/summary)
export type MyCodexSummary = {
  recipeCount: number;
  secretFound: number;
  secretTotal: number;
  legendFound: number;
  legendTotal: number;
  progressRate: number; // 비밀 레시피 진행률 0~100
};

async function get<T>(path: string): Promise<T> {
  await connection(); // 요청이 올 때마다 백엔드에서 받는다
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store", headers: { cookie: (await cookies()).toString() } });
  if (res.status === 401 || res.status === 403) redirect("/login");
  if (!res.ok) throw new Error(`백엔드 요청 실패: GET ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

export const getMyRecipes = () => get<MyRecipe[]>("/api/v1/my/recipes");
export const getMySecretRecipes = () => get<MySecretRecipe[]>("/api/v1/my/secret-recipes");
export const getMyCodexSummary = () => get<MyCodexSummary>("/api/v1/my/recipes/summary");
