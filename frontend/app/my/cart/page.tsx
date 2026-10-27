import type { Metadata } from "next";
import UserHeader from "../../_components/UserHeader";
import ServerCartView from "./ServerCartView";
export const metadata: Metadata = { title: "장바구니" };
export default function Page() {
  return (
    <>
      <UserHeader />
      <ServerCartView />
    </>
  );
}
