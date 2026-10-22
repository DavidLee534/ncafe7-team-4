// 관리자 화면의 조회 함수 — 백엔드(/api/v1/admin/...)에서 받아 화면용 모양(lib/types)으로 바꾼다.
// 서버 컴포넌트(페이지)에서만 부른다. 등록·수정·삭제처럼 브라우저에서 보내는 요청은 lib/apiClient.ts.
import { connection } from "next/server";
import type {
  Category,
  Ingredient,
  IngredientType,
  IngredientTypeCounts,
  Menu,
  MenuCategory,
  MenuStatus,
  MenuStatusCounts,
} from "./types";

// 서버에서 부르므로 백엔드 주소로 바로 보낸다 (브라우저 요청은 next.config 의 rewrites 를 거친다)
const API_URL = process.env.API_URL ?? "http://localhost:8080";

// ===== 백엔드 응답 모양 =====

type CategoryResponse = {
  id: number;
  name: string;
  engName: string;
  sortOrder: number;
  visible: boolean;
  menuCount: number;
  createdAt: string; // "2026-10-20T16:23:27.47"
};

type MenuResponse = {
  id: number;
  korName: string;
  engName: string;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  description: string | null;
  imageUrl: string | null;
  status: string;
  ownerRecommended: boolean;
  slug?: string | null; // 상세 응답에만 있음
  emotionTags?: string[];
  tasteTags?: string[];
  createdAt: string | null;
  updatedAt: string | null;
};

type IngredientResponse = {
  id: number;
  name: string;
  type: string;
  shelf: string;
  price: number;
  color: string;
  effectTags: string[];
  modifier: string | null;
  modifierPriority: number | null;
  visible: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CategoryWithCount = Category & { menuCount: number };

// 없는 자원(404)이면 undefined. 그 밖의 실패는 에러로 던져 Next 의 에러 화면이 뜨게 한다
async function get<T>(path: string): Promise<T | undefined> {
  await connection(); // 빌드할 때 미리 만들지 않고 요청이 올 때마다 백엔드에서 받는다
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`백엔드 요청 실패: GET ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

const day = (value: string | null) => value?.slice(0, 10) ?? "";

function toCategory(dto: CategoryResponse): CategoryWithCount {
  return { ...dto, createdAt: day(dto.createdAt) };
}

function toMenu(dto: MenuResponse): Menu {
  return {
    id: dto.id,
    korName: dto.korName,
    engName: dto.engName,
    categoryId: dto.categoryId ?? 0,
    categoryName: dto.categoryName ?? undefined,
    slug: dto.slug ?? undefined,
    emotionTags: dto.emotionTags,
    tasteTags: dto.tasteTags,
    price: dto.price,
    description: dto.description ?? "",
    image: dto.imageUrl,
    status: (["on", "soldout", "hidden"].includes(dto.status) ? dto.status : "on") as MenuStatus,
    isNew: false, // 백엔드에 아직 없음
    isSecret: false, // 백엔드에 아직 없음
    isRecommended: dto.ownerRecommended,
    createdAt: day(dto.createdAt),
    updatedAt: day(dto.updatedAt),
  };
}

function toIngredient(dto: IngredientResponse): Ingredient {
  return {
    ...dto,
    type: dto.type === "base" ? "base" : "extra",
    modifier: dto.modifier ?? "",
    createdAt: day(dto.createdAt),
    updatedAt: day(dto.updatedAt),
  };
}

// ===== 카테고리 =====

// 화면 순서(sortOrder)대로, 카테고리별 메뉴 수 포함
export async function getCategories(): Promise<CategoryWithCount[]> {
  const list = await get<CategoryResponse[]>("/api/v1/admin/categories");
  return (list ?? []).map(toCategory);
}

export async function getCategory(id: number): Promise<CategoryWithCount | undefined> {
  if (!Number.isInteger(id)) return undefined;
  const dto = await get<CategoryResponse>(`/api/v1/admin/categories/${id}`);
  return dto && toCategory(dto);
}

// ===== 메뉴 =====

// 거르기·정렬·개수 제한은 백엔드가 한다. 비운 조건은 보내지 않고, 조건이 없으면 전체 목록(등록순)
// sort: "updatedAt" 이면 최근 수정순
export type MenuFilter = {
  categoryId?: number;
  status?: MenuStatus;
  keyword?: string;
  ownerRecommended?: boolean;
  sort?: "updatedAt";
  size?: number;
};

export async function getMenus(filter: MenuFilter = {}): Promise<Menu[]> {
  const query = new URLSearchParams();
  if (filter.categoryId) query.set("categoryId", String(filter.categoryId));
  if (filter.status) query.set("status", filter.status);
  if (filter.keyword?.trim()) query.set("keyword", filter.keyword.trim());
  if (filter.ownerRecommended !== undefined) query.set("ownerRecommended", String(filter.ownerRecommended));
  if (filter.sort) query.set("sort", filter.sort);
  if (filter.size) query.set("size", String(filter.size));
  const qs = query.size > 0 ? `?${query}` : "";
  const list = await get<MenuResponse[]>(`/api/v1/admin/menus${qs}`);
  return (list ?? []).map(toMenu);
}

export async function getMenu(id: number): Promise<Menu | undefined> {
  if (!Number.isInteger(id)) return undefined;
  const dto = await get<MenuResponse>(`/api/v1/admin/menus/${id}`);
  return dto && toMenu(dto);
}

// 메뉴 화면의 카테고리 칩·선택 상자. 화면 순서대로, 카테고리별 메뉴 수 포함
export async function getMenuCategories(): Promise<MenuCategory[]> {
  return (await get<MenuCategory[]>("/api/v1/admin/menus/categories")) ?? [];
}

// 상태별 메뉴 수. 검색 조건과 상관없이 세고, categoryId 를 주면 그 카테고리 안에서만 센다
export async function getMenuSummary(categoryId?: number): Promise<MenuStatusCounts> {
  const qs = categoryId ? `?categoryId=${categoryId}` : "";
  return (await get<MenuStatusCounts>(`/api/v1/admin/menus/summary${qs}`)) ?? { all: 0, on: 0, soldout: 0, hidden: 0 };
}

// ===== 재료 =====

// 거르기는 백엔드가 한다. 비운 조건은 보내지 않고, 조건이 없으면 전체 목록 (기반 재료 먼저, 계열·선반 이름순)
export type IngredientFilter = {
  type?: IngredientType;
  shelf?: string;
  keyword?: string;
};

export async function getIngredients(filter: IngredientFilter = {}): Promise<Ingredient[]> {
  const query = new URLSearchParams();
  if (filter.type) query.set("type", filter.type);
  if (filter.shelf) query.set("shelf", filter.shelf);
  if (filter.keyword?.trim()) query.set("keyword", filter.keyword.trim());
  const qs = query.size > 0 ? `?${query}` : "";
  const list = await get<IngredientResponse[]>(`/api/v1/admin/ingredients${qs}`);
  return (list ?? []).map(toIngredient);
}

export async function getIngredient(id: number): Promise<Ingredient | undefined> {
  if (!Number.isInteger(id)) return undefined;
  const dto = await get<IngredientResponse>(`/api/v1/admin/ingredients/${id}`);
  return dto && toIngredient(dto);
}

// ===== 받은 목록을 화면에서 세기 (대시보드 · 재료 목록) =====

export function countIngredientsByType(ingredients: Ingredient[]): IngredientTypeCounts {
  return {
    all: ingredients.length,
    base: ingredients.filter((i) => i.type === "base").length,
    extra: ingredients.filter((i) => i.type === "extra").length,
  };
}

export function countMenusByStatus(menus: Menu[]): MenuStatusCounts {
  return {
    all: menus.length,
    on: menus.filter((m) => m.status === "on").length,
    soldout: menus.filter((m) => m.status === "soldout").length,
    hidden: menus.filter((m) => m.status === "hidden").length,
  };
}
