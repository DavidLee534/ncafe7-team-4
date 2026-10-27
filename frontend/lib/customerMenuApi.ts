import { connection } from "next/server";
import { basicMenus, type BasicMenu, type Emotion, type Taste } from "@/app/menu/_components/alchemyMenus";
import type { Menu } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export type CustomerMenu = {
  id: number;
  korName: string;
  engName: string;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  categorySortOrder: number | null;
  description: string | null;
  imageUrl: string | null;
  status: "on" | "soldout";
  ownerRecommended: boolean;
  emotionTags: string[];
  tasteTags: string[];
};

async function get<T>(path: string): Promise<T | undefined> {
  await connection();
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`메뉴를 불러오지 못했습니다. (${response.status})`);
  return response.json() as Promise<T>;
}

export async function getCustomerMenus(): Promise<CustomerMenu[]> {
  return (await get<CustomerMenu[]>("/api/v1/menus")) ?? [];
}

export async function getCustomerMenu(id: number): Promise<CustomerMenu | undefined> {
  if (!Number.isInteger(id)) return undefined;
  return get<CustomerMenu>(`/api/v1/menus/${id}`);
}

export function toBookMenu(menu: CustomerMenu): Menu {
  return {
    id: menu.id,
    korName: menu.korName,
    engName: menu.engName,
    categoryId: menu.categoryId ?? 0,
    categoryName: menu.categoryName ?? undefined,
    price: menu.price,
    description: menu.description ?? "",
    image: menu.imageUrl,
    status: menu.status,
    isNew: false,
    isSecret: false,
    isRecommended: menu.ownerRecommended,
    emotionTags: menu.emotionTags,
    tasteTags: menu.tasteTags,
    createdAt: "",
    updatedAt: "",
  };
}

// 기본·감정 연금술에 쓰는 고정된 포션 이름은 유지하고, 판매 여부와 가격·태그는 DB에서 읽는다.
export function getAvailableBasicMenus(catalog: CustomerMenu[]): BasicMenu[] {
  const byBase = new Map(catalog.filter(menu => menu.status === "on").map(menu => [menu.korName, menu]));
  return basicMenus.flatMap(menu => {
    const live = byBase.get(menu.base);
    if (!live) return [];
    return [{
      ...menu,
      id: live.id,
      category: live.categoryName ?? menu.category,
      price: live.price,
      description: live.description ?? menu.description,
      emotions: live.emotionTags as Emotion[],
      tastes: live.tasteTags as Taste[],
    }];
  });
}
