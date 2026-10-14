// 모의 결제 주문 — 결제 팝업(PaymentPopup)에서 모의 승인이 나면 주문을 만들어 브라우저에 저장한다.
// 결제 API가 생기면 팝업은 결제사 결제창으로, placeOrder 본문은 서버 호출로 바꾸면 된다.
import { cartCount, cartTotal, clearCart, type CartItem } from "./cart";
import { createLocalStore } from "./localStore";

export type PayMethod = "card" | "easy" | "transfer";
export type PickupType = "dine-in" | "takeout";

export const PAY_METHODS: Record<PayMethod, string> = {
  card: "신용·체크카드",
  easy: "간편결제",
  transfer: "계좌이체",
};

export const PICKUP_TYPES: Record<PickupType, string> = {
  "dine-in": "매장에서 마실게요",
  takeout: "포장해 갈게요",
};

export type OrderInfo = {
  pickupName: string; // 포션이 나오면 불러 줄 이름
  pickupType: PickupType;
  payMethod: PayMethod;
  request: string;
  payDetail: string; // 결제창에서 고른 내용 (예: 달빛카드 · 일시불)
};

export type Order = OrderInfo & {
  id: string; // 주문번호 (예: NC261014-4821)
  items: CartItem[];
  count: number;
  total: number;
  approvalCode: string; // 모의 승인번호
  paidAt: string; // "2026-10-14 15:42"
};

const store = createLocalStore<Order[]>("ncafe-orders", []);

const pad = (n: number) => String(n).padStart(2, "0");
const digits = (length: number) => Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

// 모의 승인이 난 뒤 호출 — 주문을 저장하고 장바구니를 비운다.
export function placeOrder(cart: CartItem[], info: OrderInfo): Order {
  const now = new Date();
  const order: Order = {
    ...info,
    id: `NC${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${digits(4)}`,
    items: cart,
    count: cartCount(cart),
    total: cartTotal(cart),
    approvalCode: digits(8),
    paidAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
  store.set([order, ...store.get()]);
  clearCart();
  return order;
}

// 이 브라우저에서 한 주문 전체(최근 주문이 앞). 서버에서 그릴 때는 null.
export function useOrders(): Order[] | null {
  return store.useValue();
}

// 주문 하나. 서버에서 그릴 때는 null(불러오는 중), 없는 주문번호면 undefined.
export function useOrder(id: string): Order | null | undefined {
  const orders = store.useValue();
  return orders === null ? null : orders.find((order) => order.id === id);
}
