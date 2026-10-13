// 메뉴 상세 헤더의 버튼 — 목록으로 · 수정 · 삭제(목업)
import Link from "next/link";
import type { Menu } from "@/lib/types";
import MockActionButton from "../../../_components/MockActionButton";

export default function MenuDetailActions({ menu }: { menu: Pick<Menu, "id" | "korName"> }) {
  return (
    <>
      <Link href="/admin/menus" className="m3-btn btn:outlined">
        목록으로
      </Link>
      <Link href={`/admin/menus/${menu.id}/edit`} className="m3-btn">
        수정
      </Link>
      <MockActionButton
        confirmMessage={`'${menu.korName}' 메뉴를 삭제할까요?`}
        className="m3-btn btn:outlined btn-color:danger"
      >
        삭제
      </MockActionButton>
    </>
  );
}
