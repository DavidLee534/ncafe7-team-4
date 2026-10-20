// 관리자 화면의 조회 함수 — 백엔드(/api/v1/admin/...)에서 받아 화면용 모양(lib/types)으로 바꾼다.
// 서버 컴포넌트(페이지)에서만 부른다. 등록·수정·삭제처럼 브라우저에서 보내는 요청은 lib/apiClient.ts.
import { connection } from "next/server";
import type { Category, Menu, MenuStatus, MenuStatusCounts } from "./types";

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

export async function getMenus(): Promise<Menu[]> {
  const list = await get<MenuResponse[]>("/api/v1/admin/menus");
  return (list ?? []).map(toMenu);
}

export async function getMenu(id: number): Promise<Menu | undefined> {
  if (!Number.isInteger(id)) return undefined;
  const dto = await get<MenuResponse>(`/api/v1/admin/menus/${id}`);
  return dto && toMenu(dto);
}

// ===== 받은 목록을 화면에서 거르고 세기 =====
// 백엔드에 검색 조건(?categoryId=&status=&keyword=)이 생기면 getMenus 에서 쿼리로 보내도록 바꾼다

export type MenuFilter = { categoryId?: number; status?: MenuStatus; keyword?: string };

export function filterMenus(menus: Menu[], filter: MenuFilter = {}): Menu[] {
  const keyword = filter.keyword?.trim().toLowerCase();
  return menus
    .filter((m) => !filter.categoryId || m.categoryId === filter.categoryId)
    .filter((m) => !filter.status || m.status === filter.status)
    .filter(
      (m) => !keyword || m.korName.toLowerCase().includes(keyword) || m.engName.toLowerCase().includes(keyword),
    );
}

export function countMenusByStatus(menus: Menu[]): MenuStatusCounts {
  return {
    all: menus.length,
    on: menus.filter((m) => m.status === "on").length,
    soldout: menus.filter((m) => m.status === "soldout").length,
    hidden: menus.filter((m) => m.status === "hidden").length,
  };
}
