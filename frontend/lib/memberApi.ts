export type Showcase = {
  id: number; title: string; nickname: string; recipeName: string; recipeGrade: string;
  recipeColor: string; averageScore: number; ratingCount: number; createdAt: string;
};
export type ShowcaseDetail = Showcase & {
  content: string | null; recipeId: number; recipePrice: number; myScore: number | null; mine: boolean;
};
export type ShowcaseComment = {
  id: number; parentId: number | null; nickname: string; content: string;
  createdAt: string; mine: boolean; deleted: boolean;
};
export type MyRecipe = { id: number; name: string; grade: string; price: number; color: string; baseMenuName: string; createdAt: string };
export type Account = { email: string; nickname: string; createdAt: string };
export type Membership = { level: number; name: string; orderCount: number; nextLevelAt: number | null };
export type MyOrder = { id: number; orderNumber: string; status: string; itemSummary: string; totalPrice: number; createdAt: string };
export type MyOrderDetail = MyOrder & {
  pickupName: string; pickupType: string; request: string | null;
  items: { name: string; options: string | null; unitPrice: number; quantity: number; lineTotal: number }[];
  payment: { method: string; detail: string | null; amount: number; approvalCode: string; paidAt: string } | null;
};
export type OrderSummary = { all: number; inProgress: number; done: number; cancelled: number };
export type MyShowcase = { id: number; title: string; recipeName: string; averageScore: number; createdAt: string };

export async function memberApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    cache: "no-store",
    ...init,
    headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `요청에 실패했습니다. (${response.status})`);
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const dateText = (value: string) => value?.replace("T", " ").slice(0, 16) ?? "";
export const priceText = (value: number) => `${value.toLocaleString("ko-KR")}원`;
