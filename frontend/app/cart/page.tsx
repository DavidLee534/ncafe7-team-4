import type { Metadata } from "next";
import CartPage from "./_components/CartPage";

export const metadata: Metadata = { title: "장바구니" };

export default function CustomerCartPage() {
  return <CartPage />;
}
