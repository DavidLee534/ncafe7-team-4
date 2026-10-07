// 카테고리 등록 — 브레드크럼 · 머리 · CategoryForm. 정렬 순서는 맨 뒤 번호를 기본값으로 둔다.
import Link from "next/link";
import CategoryForm from "../_components/CategoryForm";
import { getCategories } from "@/lib/mock";

export default function AdminCategoryCreatePage() {
  const nextSortOrder = Math.max(0, ...getCategories().map((c) => c.sortOrder)) + 1;

  return (
    <>
      <nav className="m3-breadcrumb breadcrumb-size:sm" aria-label="현재 위치">
        <span>카테고리 관리</span>
        <Link href="/admin/categories/list">카테고리 목록</Link>
        <span aria-current="page">카테고리 등록</span>
      </nav>

      <div className="display:flex align-items:flex-end justify-content:space-between flex-wrap:wrap gap:4 margin-bottom:7">
        <div>
          <h1 className="font-size:heading-md font-weight:bold letter-spacing:tight">카테고리 등록</h1>
          <p className="margin-top:2 font-size:body-sm color:text-muted">새 카테고리를 만듭니다.</p>
        </div>
        <Link href="/admin/categories/list" className="m3-btn btn:outlined">
          목록으로
        </Link>
      </div>

      <CategoryForm mode="create" nextSortOrder={nextSortOrder} cancelHref="/admin/categories/list" />
    </>
  );
}
