// 모의 결제 완료 — 주문번호(?order=)를 받아 영수증을 보여준다. 주문은 브라우저에 저장돼 있어 OrderReceipt(클라이언트)가 그린다.
import type { Metadata } from "next";
import UserHeader from "../../_components/UserHeader";
import OrderReceipt from "./_components/OrderReceipt";

export const metadata: Metadata = { title: "결제 완료" };

export default async function CheckoutCompletePage(props: PageProps<"/checkout/complete">) {
  const { order } = await props.searchParams;

  return (
    <>
      <UserHeader />
      <OrderReceipt orderId={typeof order === "string" ? order : ""} />
    </>
  );
}
