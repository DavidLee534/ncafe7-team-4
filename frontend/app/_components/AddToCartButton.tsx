"use client";
// 장바구니 담기 버튼 — 서버 장바구니(POST /api/v1/my/cart/items)에 메뉴 번호나 저장된 포션 번호로 담고,
// "담았어요" 안내와 장바구니 링크를 보여준다. 가격은 서버가 DB 에서 읽으므로 보내지 않는다.
import { useState } from "react";
import Link from "next/link";
import { addServerCartItem } from "@/lib/cart";

type Props = {
  name: string; // 버튼 설명(aria-label)에만 쓴다
  menuId?: number;
  recipeId?: number;
  disabled?: boolean;
  disabledLabel?: string;
};

export default function AddToCartButton({ name, menuId, recipeId, disabled = false, disabledLabel = "담을 수 없어요" }: Props) {
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  if (added) {
    return (
      <span role="status" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem" }}>
        담았어요!
        <Link href="/my/cart" className="m3-btn btn:text btn-size:xs">
          장바구니 보기 →
        </Link>
      </span>
    );
  }
  return (
    <button
      type="button"
      className="m3-btn btn-size:xs"
      onClick={async () => {
        setBusy(true);
        try {
          await addServerCartItem(recipeId ? { recipeId } : { menuId });
          setAdded(true);
        } catch (error) {
          window.alert(error instanceof Error ? error.message : "담지 못했어요.");
        } finally {
          setBusy(false);
        }
      }}
      disabled={disabled || busy}
      aria-label={`${name} 장바구니에 담기`}
    >
      {disabled ? disabledLabel : "🛒 담기"}
    </button>
  );
}
