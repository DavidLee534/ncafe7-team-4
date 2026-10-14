// 장바구니 — 백엔드 주문 API 가 생기기 전까지 브라우저 localStorage 에 보관한다.

import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string; // 같은 이름·구성이면 같은 id 로 묶어 수량만 올린다
  name: string; // 연금술 이름 (예: 빛과 어둠의 균형 포션)
  detail: string; // 재료 구성 또는 기본 메뉴 이름
  icon: string;
  price: number; // 1개 가격
  quantity: number;
};

const STORAGE_KEY = "nyang-cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedItems;
  }
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items);
  cachedRaw = raw;
  cachedItems = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // 저장이 막힌 브라우저에서는 이번 탭에서만 유지한다
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => event.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage); // 다른 탭에서 바꾼 장바구니도 반영
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function addToCart(item: Omit<CartItem, "id" | "quantity">, quantity = 1) {
  const id = `${item.name}|${item.detail}|${item.price}`;
  const items = read();
  const existing = items.find((cartItem) => cartItem.id === id);
  write(
    existing
      ? items.map((cartItem) => (cartItem.id === id ? { ...cartItem, quantity: Math.min(cartItem.quantity + quantity, 99) } : cartItem))
      : [...items, { ...item, id, quantity }],
  );
}

export function setCartQuantity(id: string, quantity: number) {
  write(quantity <= 0 ? read().filter((item) => item.id !== id) : read().map((item) => (item.id === id ? { ...item, quantity: Math.min(quantity, 99) } : item)));
}

export function removeFromCart(id: string) {
  write(read().filter((item) => item.id !== id));
}

export function clearCart() {
  write(EMPTY);
}

export const cartCount = (items: CartItem[]) => items.reduce((total, item) => total + item.quantity, 0);
export const cartTotal = (items: CartItem[]) => items.reduce((total, item) => total + item.price * item.quantity, 0);
