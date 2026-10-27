// 손님 화면의 조회 함수 — 백엔드(/api/v1/menus/..., /api/v1/recipes/...)에서 받는다.
// 서버 컴포넌트(페이지)에서만 부른다. 포션 만들기처럼 브라우저에서 보내는 요청은 lib/apiClient.ts.
import { connection } from "next/server";

// 서버에서 부르므로 백엔드 주소로 바로 보낸다 (브라우저 요청은 next.config 의 rewrites 를 거친다)
const API_URL = process.env.API_URL ?? "http://localhost:8080";

// ===== 백엔드 응답 모양 (화면에서도 그대로 쓴다) =====

// 재료 선반 — 계열 하나
export type IngredientShelf = {
  categoryId: number;
  categoryName: string;
  spell: string; // 포션 이름 뒷부분 (예: 어둠의 물약)
  bases: { menuId: number; ingredientName: string; menuName: string; price: number }[]; // 필수 재료 (메뉴 하나에 재료 하나, 가격은 메뉴 가격)
  extras: { name: string; icon: string; price: number }[];
};

export type RecipeEmotions = {
  emotions: { name: string; color: string }[];
  tastes: string[];
};

export type MenuStatus = "on" | "soldout" | "hidden";

// 손님 메뉴판(/menus)의 메뉴 한 줄. 숨김 메뉴는 오지 않으므로 status 는 on 또는 soldout
export type PublicMenu = {
  id: number;
  slug: string;
  korName: string;
  engName: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string | null;
  status: Exclude<MenuStatus, "hidden">;
};

export type PublicMenuDetail = PublicMenu & {
  description: string | null;
  emotionTags: string[];
  tasteTags: string[];
};

// 메뉴판의 카테고리 탭. menuCount 는 손님에게 보이는 메뉴 수
export type PublicMenuCategory = { id: number; name: string; engName: string; menuCount: number };

// 기본 메뉴 고르기 · 감정 추천의 메뉴 한 줄
export type RecipeMenu = {
  menuId: number;
  slug: string | null;
  korName: string;
  engName: string;
  categoryId: number | null;
  categoryName: string | null;
  price: number;
  imageUrl: string | null;
  description: string | null;
  status: MenuStatus;
  emotionTags: string[];
  tasteTags: string[];
};

export type RecipeRecommendation = Omit<RecipeMenu, "categoryId" | "status"> & { score: number };

// 포션 만들기 응답 (도감에 저장된 포션)
export type CreatedRecipe = {
  id: number;
  name: string;
  grade: "normal" | "rare" | "legend";
  price: number;
  color: string;
  baseMenuId: number;
  baseMenuName: string;
  baseIngredientName: string;
  extras: string[];
  secretRecipeName: string | null;
  newlyDiscovered: boolean;
};


// 없는 자원(404)이면 undefined. 그 밖의 실패는 에러로 던져 Next 의 에러 화면이 뜨게 한다
async function find<T>(path: string): Promise<T | undefined> {
  await connection(); // 빌드할 때 미리 만들지 않고 요청이 올 때마다 백엔드에서 받는다
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`백엔드 요청 실패: GET ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

// 목록처럼 404가 날 일이 없는 조회
async function get<T>(path: string): Promise<T> {
  const data = await find<T>(path);
  if (data === undefined) throw new Error(`백엔드 요청 실패: GET ${path} (404)`);
  return data;
}

// ===== 메뉴 조회 =====

// 거르기는 백엔드가 한다. 비운 조건은 보내지 않는다
export function getMenus(filter: { categoryId?: number; keyword?: string } = {}): Promise<PublicMenu[]> {
  const query = new URLSearchParams();
  if (filter.categoryId) query.set("categoryId", String(filter.categoryId));
  if (filter.keyword?.trim()) query.set("keyword", filter.keyword.trim());
  return get(`/api/v1/menus${query.size > 0 ? `?${query}` : ""}`);
}

export function getMenuCategories(): Promise<PublicMenuCategory[]> {
  return get("/api/v1/menus/categories");
}

// 사장 추천 메뉴
export function getMenuRecommendations(): Promise<PublicMenu[]> {
  return get("/api/v1/menus/recommendations");
}

// 없거나 숨긴 메뉴면 undefined
export function getMenuBySlug(slug: string): Promise<PublicMenuDetail | undefined> {
  return find(`/api/v1/menus/${encodeURIComponent(slug)}`);
}

// ===== 레시피 등록 =====

export function getIngredientShelves(): Promise<IngredientShelf[]> {
  return get("/api/v1/recipes/ingredients");
}

export function getRecipeEmotions(): Promise<RecipeEmotions> {
  return get("/api/v1/recipes/emotions");
}

// 숨김 메뉴는 오지 않는다. categoryId 를 주면 그 계열만
export function getRecipeMenus(categoryId?: number): Promise<RecipeMenu[]> {
  return get(`/api/v1/recipes/menus${categoryId ? `?categoryId=${categoryId}` : ""}`);
}
