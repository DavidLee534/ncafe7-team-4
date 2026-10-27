import type { Metadata } from "next";
import UserHeader from "../../../_components/UserHeader";
import ServerReceipt from "./ServerReceipt";
export const metadata: Metadata = { title: "모의 결제 영수증" };
export default async function Page(props: PageProps<"/orders/complete/[id]">) {
  const { id } = await props.params;
  return (
    <>
      <UserHeader />
      <ServerReceipt id={id} />
    </>
  );
}
