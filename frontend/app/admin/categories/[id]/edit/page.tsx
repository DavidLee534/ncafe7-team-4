// 카테고리 수정 — 밤하늘 헤더 · CategoryForm(기존 값). 없는 id면 404.
import Link from "next/link";
import NightHero, { heroOverlap } from "../../../_components/NightHero";
import { notFound } from "next/navigation";
import CategoryForm from "../../_components/CategoryForm";
import { countMenusByCategory, getCategory } from "@/lib/mock";

export default async function AdminCategoryEditPage(props: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await props.params;
  const category = getCategory(Number(id));
  if (!category) notFound();

  return (
    <>
      <NightHero
        crumb="CATEGORY / EDIT"
        title="카테고리 수정"
        description={<>카테고리 번호 #{category.id} · 메뉴 {countMenusByCategory(category.id)}개</>}
        actions={
          <>
            <Link href="/admin/categories/list" className="m3-btn btn:outlined">
              목록으로
            </Link>
          </>
        }
      />

      <div className={heroOverlap}>
        <CategoryForm mode="edit" initial={category} cancelHref="/admin/categories/list" />
      </div>
    </>
  );
}
