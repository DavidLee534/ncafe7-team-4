export type ServerCartItem = {
  id: number;
  itemType: "menu" | "recipe";
  menuId: number | null;
  recipeId: number | null;
  name: string;
  options: string[];
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  available: boolean;
};
export type ServerCart = {
  items: ServerCartItem[];
  totalPrice: number;
  totalQuantity: number;
  version: string;
};
export type CatalogEntry = {
  menuId: number | null;
  recipeId: number | null;
  name: string;
  unitPrice: number;
  imageUrl: string | null;
};
export type Receipt = {
  id: number;
  orderNumber: string;
  status: string;
  pickupName: string;
  pickupType: string;
  request: string | null;
  totalPrice: number;
  items: {
    itemType: string;
    name: string;
    options: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  payment: {
    method: string;
    detail: string | null;
    amount: number;
    approvalCode: string;
    paidAt: string;
  };
};
export type CheckoutBody = {
  pickupName: string;
  pickupType: string;
  request: string;
  payMethod: string;
  payDetail: string;
  cartVersion: string;
};

export class CheckoutApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function checkoutApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new CheckoutApiError(
      response.status,
      body?.message ??
        (response.status === 401
          ? "로그인한 뒤 이용해 주세요."
          : `요청에 실패했습니다. (${response.status})`),
    );
  }
  return response.status === 204
    ? (undefined as T)
    : (response.json() as Promise<T>);
}
