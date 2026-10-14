// 장바구니 — 브라우저에 저장하고, 헤더 · 공방 · 장바구니 · 결제 페이지가 같은 값을 본다.
import { createLocalStore } from "./localStore";

export type CartItem = {
  key: string; // 같은 포션(이름 + 재료)이면 같은 값 → 수량만 늘린다
  name: string;
  options: string[]; // 기반 재료와 추가 재료. 고른 순서 그대로 보여준다
  unitPrice: number;
  quantity: number;
};

export const MAX_QUANTITY = 20;

const store = createLocalStore<CartItem[]>("ncafe-cart", []);

// 서버에서 그릴 때는 null
export function useCart(): CartItem[] | null {
  return store.useValue();
}

export function addToCart(potion: { name: string; options: string[]; unitPrice: number }) {
  const items = store.get();
  const key = [potion.name, ...[...potion.options].sort()].join("|");
  const found = items.find((item) => item.key === key);
  store.set(
    found
      ? items.map((item) => (item.key === key ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) } : item))
      : [...items, { key, ...potion, quantity: 1 }],
  );
}

export function setQuantity(key: string, quantity: number) {
  const next = Math.max(1, Math.min(quantity, MAX_QUANTITY));
  store.set(store.get().map((item) => (item.key === key ? { ...item, quantity: next } : item)));
}

export function removeFromCart(key: string) {
  store.set(store.get().filter((item) => item.key !== key));
}

export function clearCart() {
  store.set([]);
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
