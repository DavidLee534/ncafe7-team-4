// 카테고리 등록 — 밤하늘 헤더 · CategoryForm. 정렬 순서는 맨 뒤 번호를 기본값으로 둔다.
import Link from "next/link";
import NightHero, { heroOverlap } from "../../_components/NightHero";
import CategoryForm from "../_components/CategoryForm";
import { getCategories } from "@/lib/mock";

export default function AdminCategoryCreatePage() {
  const nextSortOrder = Math.max(0, ...getCategories().map((c) => c.sortOrder)) + 1;

  return (
    <>
      <NightHero
        crumb="CATEGORY / NEW"
        title="카테고리 등록"
        description="새 카테고리를 만듭니다."
        actions={
          <>
            <Link href="/admin/categories/list" className="m3-btn btn:outlined">
              목록으로
            </Link>
          </>
        }
      />

      <div className={heroOverlap}>
        <CategoryForm mode="create" nextSortOrder={nextSortOrder} cancelHref="/admin/categories/list" />
      </div>
    </>
  );
}
