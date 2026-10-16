// 메뉴 상세 헤더의 버튼 — 목록으로 · 수정 · 비밀 레시피 등록/해제(목업) · 삭제(목업)
import Link from "next/link";
import type { Menu } from "@/lib/types";
import MockActionButton from "../../../_components/MockActionButton";

export default function MenuDetailActions({ menu }: { menu: Pick<Menu, "id" | "korName" | "isSecret"> }) {
  return (
    <>
      <Link href="/admin/menus" className="m3-btn btn:outlined">
        목록으로
      </Link>
      <Link href={`/admin/menus/${menu.id}/edit`} className="m3-btn">
        수정
      </Link>
      <MockActionButton
        confirmMessage={
          menu.isSecret
            ? `'${menu.korName}'을(를) 비밀 레시피에서 해제할까요?`
            : `'${menu.korName}'을(를) 비밀 레시피로 등록할까요?`
        }
        className="m3-btn btn:outlined"
      >
        {menu.isSecret ? "비밀 레시피 해제" : "🪄 비밀 레시피로 등록"}
      </MockActionButton>
      <MockActionButton
        confirmMessage={`'${menu.korName}' 메뉴를 삭제할까요?`}
        className="m3-btn btn:outlined btn-color:danger"
      >
        삭제
      </MockActionButton>
    </>
  );
}
