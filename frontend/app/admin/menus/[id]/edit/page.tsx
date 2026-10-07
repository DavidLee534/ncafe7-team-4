// 메뉴 수정 — 브레드크럼 · 머리 · MenuForm(기존 값). 없는 id면 404.
import Link from "next/link";
import { notFound } from "next/navigation";
import MenuForm from "../../_components/MenuForm";
import { getCategories, getMenu } from "@/lib/mock";

export default async function AdminMenuEditPage(props: PageProps<"/admin/menus/[id]/edit">) {
  const { id } = await props.params;
  const menu = getMenu(Number(id));
  if (!menu) notFound();
  const detailHref = `/admin/menus/${menu.id}`;

  return (
    <>
      <nav className="m3-breadcrumb breadcrumb-size:sm" aria-label="현재 위치">
        <span>메뉴 관리</span>
        <Link href="/admin/menus/list">메뉴 목록</Link>
        <Link href={detailHref}>{menu.korName}</Link>
        <span aria-current="page">수정</span>
      </nav>

      <div className="display:flex align-items:flex-end justify-content:space-between flex-wrap:wrap gap:4 margin-bottom:7">
        <div>
          <h1 className="font-size:heading-md font-weight:bold letter-spacing:tight">메뉴 수정</h1>
          <p className="margin-top:2 font-size:body-sm color:text-muted">
            메뉴 번호 #{menu.id} · 마지막 수정 {menu.updatedAt}
          </p>
        </div>
        <Link href={detailHref} className="m3-btn btn:outlined">
          상세로 돌아가기
        </Link>
      </div>

      <MenuForm mode="edit" initial={menu} categories={getCategories()} cancelHref={detailHref} />
    </>
  );
}
