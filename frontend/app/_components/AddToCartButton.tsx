"use client";
// 장바구니 담기 버튼 — 브라우저 장바구니(lib/cart)에 담고 "담았어요" 안내와 장바구니 링크를 보여준다.
// 백엔드 장바구니(WBS 5.0)가 생기면 이 버튼만 POST /api/v1/my/cart/items 로 바꾼다.
import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

type Props = {
  name: string;
  options: string[]; // 장바구니에 보이는 재료 · 설명
  unitPrice: number;
  disabled?: boolean;
  disabledLabel?: string;
};

export default function AddToCartButton({ name, options, unitPrice, disabled = false, disabledLabel = "담을 수 없어요" }: Props) {
  const [added, setAdded] = useState(false);

  if (added) {
    return (
      <span role="status" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem" }}>
        담았어요!
        <Link href="/cart" className="m3-btn btn:text btn-size:xs">
          장바구니 보기 →
        </Link>
      </span>
    );
  }
  return (
    <button
      type="button"
      className="m3-btn btn-size:xs"
      onClick={() => {
        addToCart({ name, options, unitPrice });
        setAdded(true);
      }}
      disabled={disabled}
      aria-label={`${name} 장바구니에 담기`}
    >
      {disabled ? disabledLabel : "🛒 담기"}
    </button>
  );
}
