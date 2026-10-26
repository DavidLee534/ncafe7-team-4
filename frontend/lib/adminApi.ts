// 관리자 화면의 조회 함수 — 백엔드(/api/v1/admin/...)에서 받아 화면용 모양(lib/types)으로 바꾼다.
// 서버 컴포넌트(페이지)에서만 부른다. 등록·수정·삭제처럼 브라우저에서 보내는 요청은 lib/apiClient.ts.
import { connection } from "next/server";
import type {
  Category,
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

// 상태별 주문 수와 오늘 매출. 검색 조건과 상관없이 전체를 센다
export async function getOrderSummary(): Promise<OrderSummary> {
  return (
    (await get<OrderSummary>("/api/v1/admin/orders/summary")) ?? {
      all: 0,
      paid: 0,
      brewing: 0,
      ready: 0,
      done: 0,
      cancelled: 0,
      todaySales: 0,
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

// ===== 받은 목록을 화면에서 세기 (대시보드) =====

export function countMenusByStatus(menus: Menu[]): MenuStatusCounts {
  return {
    all: menus.length,
    on: menus.filter((m) => m.status === "on").length,
    soldout: menus.filter((m) => m.status === "soldout").length,
    hidden: menus.filter((m) => m.status === "hidden").length,
  };
}
