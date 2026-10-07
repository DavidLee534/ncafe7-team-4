// 카테고리 수정 — 브레드크럼 · 머리 · CategoryForm(기존 값). 없는 id면 404.
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryForm from "../../_components/CategoryForm";
import { countMenusByCategory, getCategory } from "@/lib/mock";

export default async function AdminCategoryEditPage(props: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await props.params;
  const category = getCategory(Number(id));
  if (!category) notFound();

  return (
    <>
      <nav className="m3-breadcrumb breadcrumb-size:sm" aria-label="현재 위치">
        <span>카테고리 관리</span>
        <Link href="/admin/categories/list">카테고리 목록</Link>
        <span aria-current="page">{category.name} 수정</span>
      </nav>

      <div className="display:flex align-items:flex-end justify-content:space-between flex-wrap:wrap gap:4 margin-bottom:7">
        <div>
          <h1 className="font-size:heading-md font-weight:bold letter-spacing:tight">카테고리 수정</h1>
          <p className="margin-top:2 font-size:body-sm color:text-muted">
            카테고리 번호 #{category.id} · 메뉴 {countMenusByCategory(category.id)}개
          </p>
        </div>
        <Link href="/admin/categories/list" className="m3-btn btn:outlined">
          목록으로
        </Link>
      </div>

      <CategoryForm mode="edit" initial={category} cancelHref="/admin/categories/list" />
    </>
  );
}
