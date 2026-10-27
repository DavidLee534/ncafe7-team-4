// 메뉴 상세 헤더의 버튼 — 목록으로 · 수정 · 별도 비밀 레시피 관리 · 삭제
import Link from "next/link";
import type { Menu } from "@/lib/types";
import DeleteButton from "../../../_components/DeleteButton";

export default function MenuDetailActions({ menu }: { menu: Pick<Menu, "id" | "korName"> }) {
  return (
    <>
      <Link href="/admin/menus" className="m3-btn btn:outlined">
        목록으로
      </Link>
      <Link href={`/admin/menus/${menu.id}/edit`} className="m3-btn">
        수정
      </Link>
      <Link href="/admin/secret-recipes" className="m3-btn btn:outlined">
        비밀 레시피 관리
      </Link>
      <DeleteButton
        path={`/api/v1/admin/menus/${menu.id}`}
        confirmMessage={`'${menu.korName}' 메뉴를 삭제할까요?`}
        redirectHref="/admin/menus"
        className="m3-btn btn:outlined btn-color:danger"
      >
        삭제
      </DeleteButton>
    </>
  );
}
