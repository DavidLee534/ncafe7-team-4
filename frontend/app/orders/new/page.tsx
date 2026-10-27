import type { Metadata } from "next";
import UserHeader from "../../_components/UserHeader";
import ServerCheckoutView from "./ServerCheckoutView";
export const metadata: Metadata = { title: "주문 · 모의 결제" };
export default function Page() {
  return (
    <>
      <UserHeader />
      <ServerCheckoutView />
    </>
  );
}
