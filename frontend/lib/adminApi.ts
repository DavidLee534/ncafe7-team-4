// 관리자 화면의 조회 함수 — 백엔드(/api/v1/admin/...)에서 받아 화면용 모양(lib/types)으로 바꾼다.
// 서버 컴포넌트(페이지)에서만 부른다. 등록·수정·삭제처럼 브라우저에서 보내는 요청은 lib/apiClient.ts.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type {
  AdminMain,
  AdminMainOrder,
  Category,
  Ingredient,
  IngredientType,
  IngredientTypeCounts,
  Member,
  MemberDetail,
  MemberRole,
  MemberStatus,
  MemberSummary,
  Menu,
  MenuCategory,
  MenuStatus,
  MenuStatusCounts,
  Order,
  OrderDetail,
  OrderStatus,
  OrderSummary,
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

type AdminMainResponse = Omit<AdminMain, "attentionMenus" | "recentMenus" | "pendingOrders"> & {
  attentionMenus: MenuResponse[];
  recentMenus: MenuResponse[];
  pendingOrders: (Omit<AdminMainOrder, "createdAt"> & { createdAt: string | null })[];
};

export type CategoryWithCount = Category & { menuCount: number };

// 없는 자원(404)이면 undefined. 그 밖의 실패는 에러로 던져 Next 의 에러 화면이 뜨게 한다
// 서버에서 보내는 요청이라 브라우저 쿠키(로그인 세션)를 직접 실어 보낸다. 로그인 안 함(401)·관리자 아님(403)이면 로그인 화면으로
async function get<T>(path: string): Promise<T | undefined> {
  await connection(); // 빌드할 때 미리 만들지 않고 요청이 올 때마다 백엔드에서 받는다
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store", headers: { cookie: (await cookies()).toString() } });
  if (res.status === 401 || res.status === 403) redirect("/login");
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`백엔드 요청 실패: GET ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

const day = (value: string | null) => value?.slice(0, 10) ?? "";
// "2026-10-26T13:29:29.71" → "2026-10-26 13:29"
const minute = (value: string | null) => value?.slice(0, 16).replace("T", " ") ?? "";

// 비운 조건은 빼고 쿼리스트링을 만든다. 조건이 없으면 ""
function queryString(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    query.set(key, String(value).trim());
  }
  return query.size > 0 ? `?${query}` : "";
}

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

// ===== 비밀 레시피 =====

export type SecretRecipeGrade = "rare" | "legend";

export type SecretRecipeRow = {
  id: number;
  name: string;
  grade: SecretRecipeGrade;
  categoryId: number | null;
  categoryName: string | null;
  color: string; // #RRGGBB
  visible: boolean;
  discoveryCount: number; // 이 레시피를 발견한 회원 수
  createdAt: string; // 2026-10-27
  updatedAt: string;
};

export type SecretRecipeDetail = SecretRecipeRow & {
  description: string | null;
  riddle: string | null;
  baseIngredientId: number | null; // 재료 조합의 기반 재료. 조합이 없으면 null
  ingredientIds: number[]; // 기반 재료를 포함한 재료 id 전체. 조합이 없으면 빈 목록
};

export type SecretRecipeSummary = { all: number; rare: number; legend: number; discoveries: number };
export type SecretRecipeDiscovery = { memberId: number; nickname: string; discoveredAt: string };

export type SecretRecipeFilter = { grade?: SecretRecipeGrade; categoryId?: number; keyword?: string };

const toSecretRecipe = <T extends { createdAt: string | null; updatedAt: string | null }>(dto: T) => ({
  ...dto,
  createdAt: day(dto.createdAt),
  updatedAt: day(dto.updatedAt),
});

// 비운 조건은 보내지 않는다. 조건이 없으면 전체 목록(등록순)
export async function getSecretRecipes(filter: SecretRecipeFilter = {}): Promise<SecretRecipeRow[]> {
  const query = new URLSearchParams();
  if (filter.grade) query.set("grade", filter.grade);
  if (filter.categoryId) query.set("categoryId", String(filter.categoryId));
  if (filter.keyword?.trim()) query.set("keyword", filter.keyword.trim());
  const qs = query.size > 0 ? `?${query}` : "";
  const list = await get<SecretRecipeRow[]>(`/api/v1/admin/secret-recipes${qs}`);
  return (list ?? []).map(toSecretRecipe);
}

export async function getSecretRecipe(id: number): Promise<SecretRecipeDetail | undefined> {
  if (!Number.isInteger(id)) return undefined;
  const dto = await get<SecretRecipeDetail>(`/api/v1/admin/secret-recipes/${id}`);
  return dto && toSecretRecipe(dto);
}

// 전체·희귀·전설 레시피 수와 모든 발견 기록 수
export async function getSecretRecipeSummary(): Promise<SecretRecipeSummary> {
  return (await get<SecretRecipeSummary>("/api/v1/admin/secret-recipes/summary")) ?? { all: 0, rare: 0, legend: 0, discoveries: 0 };
}

// 등록·수정 화면의 계열 선택 상자
export async function getSecretRecipeCategories(): Promise<{ id: number; name: string }[]> {
  return (await get<{ id: number; name: string }[]>("/api/v1/admin/secret-recipes/categories")) ?? [];
}

// 이 레시피를 발견한 회원 (최근 발견순)
export async function getSecretRecipeDiscoveries(id: number): Promise<SecretRecipeDiscovery[]> {
  const list = await get<SecretRecipeDiscovery[]>(`/api/v1/admin/secret-recipes/${id}/discoveries`);
  return (list ?? []).map((d) => ({ ...d, discoveredAt: day(d.discoveredAt) }));
}

// ===== 주문 =====

// 거르기·정렬·개수 제한은 백엔드가 한다. 조건이 없으면 전체 목록(최근 주문부터)
// sort: "oldest" 면 오래된 주문부터(제조 대기 순서)
export type OrderFilter = {
  status?: OrderStatus;
  keyword?: string; // 주문번호 · 픽업 이름
  sort?: "oldest";
  size?: number;
};

export async function getOrders(filter: OrderFilter = {}): Promise<Order[]> {
  const list = await get<Order[]>(`/api/v1/admin/orders${queryString(filter)}`);
  return (list ?? []).map((dto) => ({ ...dto, createdAt: minute(dto.createdAt) }));
}

// 상태별 주문 수와 오늘 접수 금액. 검색 조건과 상관없이 전체를 센다
export async function getOrderSummary(): Promise<OrderSummary> {
  return (
    (await get<OrderSummary>("/api/v1/admin/orders/summary")) ?? {
      all: 0,
      ordered: 0,
      paid: 0,
      brewing: 0,
      ready: 0,
      done: 0,
      cancelled: 0,
      todayOrderAmount: 0,
    }
  );
}

export async function getOrder(id: number): Promise<OrderDetail | undefined> {
  if (!Number.isInteger(id)) return undefined;
  const dto = await get<OrderDetail>(`/api/v1/admin/orders/${id}`);
  return (
    dto && {
      ...dto,
      request: dto.request ?? "",
      payment: dto.payment && { ...dto.payment, paidAt: minute(dto.payment.paidAt) },
      createdAt: minute(dto.createdAt),
      updatedAt: minute(dto.updatedAt),
    }
  );
}

// ===== 회원 =====

// 조건이 없으면 전체 목록(가입순)
export type MemberFilter = {
  keyword?: string; // 이메일 · 닉네임
  status?: MemberStatus;
  role?: MemberRole;
};

export async function getMembers(filter: MemberFilter = {}): Promise<Member[]> {
  const list = await get<Member[]>(`/api/v1/admin/members${queryString(filter)}`);
  return (list ?? []).map((dto) => ({ ...dto, createdAt: day(dto.createdAt) }));
}

// 상태별 회원 수. 검색 조건과 상관없이 전체를 센다
export async function getMemberSummary(): Promise<MemberSummary> {
  return (await get<MemberSummary>("/api/v1/admin/members/summary")) ?? { all: 0, active: 0, suspended: 0 };
}

export async function getMember(id: number): Promise<MemberDetail | undefined> {
  if (!Number.isInteger(id)) return undefined;
  const dto = await get<MemberDetail>(`/api/v1/admin/members/${id}`);
  return dto && { ...dto, createdAt: day(dto.createdAt), updatedAt: day(dto.updatedAt) };
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

// ===== 관리자 메인 =====

// 메뉴 · 재료 · 주문 · 회원 현황과 최근 항목을 한 번에 받는다. 메뉴는 메뉴 API 와 같은 모양
export async function getAdminMain(): Promise<AdminMain> {
  const dto = await get<AdminMainResponse>("/api/v1/admin");
  if (!dto) throw new Error("백엔드 요청 실패: GET /api/v1/admin (404)");
  return {
    ...dto,
    attentionMenus: dto.attentionMenus.map(toMenu),
    recentMenus: dto.recentMenus.map(toMenu),
    // 주문 시각은 날짜와 분까지 ("2026-10-27T14:05:12" → "2026-10-27 14:05")
    pendingOrders: dto.pendingOrders.map((order) => ({
      ...order,
      createdAt: order.createdAt?.slice(0, 16).replace("T", " ") ?? "",
    })),
  };
}

// ===== 받은 목록을 화면에서 세기 (재료 목록) =====

export function countIngredientsByType(ingredients: Ingredient[]): IngredientTypeCounts {
  return {
    all: ingredients.length,
    base: ingredients.filter((i) => i.type === "base").length,
    extra: ingredients.filter((i) => i.type === "extra").length,
  };
}
