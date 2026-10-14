// 모의 결제 — 장바구니는 브라우저에 저장돼 있어서 화면은 CheckoutView(클라이언트)가 그린다.
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
