// 장바구니 — 담은 포션은 브라우저에 저장돼 있어서 화면은 CartView(클라이언트)가 그린다.
import type { Metadata } from "next";
import UserHeader from "../_components/UserHeader";
import CartView from "./_components/CartView";

export const metadata: Metadata = { title: "장바구니" };

export default function CartPage() {
  return (
    <>
      <UserHeader />
      <CartView />
    </>
  );
}
