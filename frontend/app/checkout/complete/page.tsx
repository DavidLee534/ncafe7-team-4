// 주문 완료 — DB 주문 ID(?order=)로 주문 내역을 조회한다.
import type { Metadata } from "next";
import UserHeader from "../../_components/UserHeader";
import OrderReceipt from "./_components/OrderReceipt";

export const metadata: Metadata = { title: "주문 완료" };

export default async function CheckoutCompletePage(props: PageProps<"/checkout/complete">) {
  const { order } = await props.searchParams;

  return (
    <>
      <UserHeader />
      <OrderReceipt orderId={typeof order === "string" ? order : ""} />
    </>
  );
}
