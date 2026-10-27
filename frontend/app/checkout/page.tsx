// 주문 접수 — 장바구니를 확인한 뒤 주문을 DB에 저장한다.
import type { Metadata } from "next";
import UserHeader from "../_components/UserHeader";
import CheckoutView from "./_components/CheckoutView";

export const metadata: Metadata = { title: "주문 · 결제" };

export default function CheckoutPage() {
  return (
    <>
      <UserHeader />
      <CheckoutView />
    </>
  );
}
