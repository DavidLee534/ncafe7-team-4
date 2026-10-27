"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/app/_components/AuthContext";
import {
  checkoutApi,
  CheckoutApiError,
  type CatalogEntry,
  type ServerCart,
} from "./checkoutApi";

export type CartItem = {
  key: string;
  name: string;
  options: string[];
  unitPrice: number;
  quantity: number;
};
export const MAX_QUANTITY = 20;

type CartState = {
  data: ServerCart | null;
  items: CartItem[] | null;
  error: string;
  status: number;
};
const initial: CartState = { data: null, items: null, error: "", status: 0 };
let state = initial;
let revision = 0;
let loading: Promise<void> | null = null;
let activeIdentity: string | undefined;
let queue: Promise<unknown> = Promise.resolve();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
function publish(next: CartState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export function refreshCart(): Promise<void> {
  if (loading) return loading;
  const current = ++revision;
  loading = checkoutApi<ServerCart>("/my/cart/items")
    .then((data) => {
      if (current === revision)
        publish({
          data,
          items: data.items.map((item) => ({
            key: String(item.id),
            name: item.name,
            options: item.options,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
          error: "",
          status: 200,
        });
    })
    .catch((error: unknown) => {
      if (current === revision)
        publish({
          data: null,
          items: null,
          error:
            error instanceof Error
              ? error.message
              : "장바구니를 불러오지 못했어요.",
          status: error instanceof CheckoutApiError ? error.status : 0,
        });
    })
    .finally(() => {
      loading = null;
    });
  return loading;
}

export function useCartState(): CartState {
  const { member, ready } = useAuth();
  const identity = member?.email ?? "";
  const value = useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
  useEffect(() => {
    if (!ready) return;
    let active = true;
    if (activeIdentity !== identity) {
      if (activeIdentity !== undefined) {
        try {
          sessionStorage.removeItem("ncafe-pending-checkout-v1");
        } catch {
          /* 저장소를 차단한 브라우저 */
        }
      }
      activeIdentity = identity;
      revision++;
      publish(initial);
    }
    void (async () => {
      await loading;
      if (active) await refreshCart();
    })();
    const refresh = () => {
      void refreshCart();
    };
    window.addEventListener("focus", refresh);
    window.addEventListener("ncafe-auth-changed", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("ncafe-auth-changed", refresh);
    };
  }, [identity, ready]);
  return ready && activeIdentity === identity ? value : initial;
}

export function useCart(): CartItem[] | null {
  return useCartState().items;
}

// 동일 탭의 빠른 연속 변경도 서버에 순서대로 보낸다.
function mutate<T>(action: () => Promise<T>): Promise<T> {
  const next = queue.then(async () => {
    const result = await action();
    await loading;
    await refreshCart();
    return result;
  });
  queue = next.catch(() => undefined);
  return next;
}

export function addServerCartItem(product: {
  menuId?: number | null;
  recipeId?: number | null;
  quantity?: number;
}) {
  return mutate(() =>
    checkoutApi("/my/cart/items", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  );
}

// 메뉴 시스템의 기존 목업 호출부를 연결하는 어댑터. 이름은 상품 식별에만 쓰고 가격은 보내지 않는다.
// 신규 메뉴·레시피 화면은 addServerCartItem({ menuId | recipeId })를 직접 사용한다.
export async function addToCart(
  potion: { name: string; options: string[]; unitPrice: number },
  quantity = 1,
) {
  const catalog = await checkoutApi<CatalogEntry[]>("/my/cart/catalog");
  const candidates = catalog.filter(
    (item) =>
      item.name === potion.name ||
      (item.menuId !== null &&
        potion.options.length === 1 &&
        item.name === potion.options[0]),
  );
  if (candidates.length !== 1)
    throw new Error(
      "서버에 저장한 메뉴나 내 레시피만 담을 수 있어요. 장바구니의 상품 목록에서 선택해 주세요.",
    );
  const item = candidates[0];
  await addServerCartItem({
    menuId: item.menuId,
    recipeId: item.recipeId,
    quantity,
  });
}
export function setQuantity(key: string, quantity: number) {
  return mutate(() =>
    checkoutApi(`/my/cart/items/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  );
}
export function removeFromCart(key: string) {
  return mutate(() =>
    checkoutApi(`/my/cart/items/${encodeURIComponent(key)}`, {
      method: "DELETE",
    }),
  );
}
export function clearCart() {
  return mutate(() => checkoutApi("/my/cart/items", { method: "DELETE" }));
}
export function cartCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
export function cartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
