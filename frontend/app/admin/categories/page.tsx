// 카테고리 목록 — 밤하늘 헤더 · 표(순서 바꾸기·이름·메뉴 수·공개 여부). 데이터는 목업.
// 페이지는 카테고리와 메뉴 수를 준비하고, 순서 변경 모드는 CategoryOrderTable 이 맡는다.
// 메뉴가 남아 있는 카테고리는 삭제할 수 없게 버튼을 막는다.
import Link from "next/link";
import NightHero, { heroOverlap } from "../_components/NightHero";
import CategoryOrderTable, { type CategoryRow } from "./_components/CategoryOrderTable";
import { countMenusByCategory, getCategories } from "@/lib/mock";

export default function AdminCategoryListPage() {
  const categories: CategoryRow[] = getCategories().map((c) => ({ ...c, menuCount: countMenusByCategory(c.id) }));

  return (
    <>
      <NightHero
        crumb="CATEGORY"
        title="카테고리 목록"
        description="메뉴를 묶는 카테고리를 관리합니다. 정렬 순서대로 사용자 화면의 탭에 나옵니다."
        actions={
          <>
            <Link href="/admin/categories/create" className="m3-btn btn-icon:leading">
              <i className="m3-icon icon:add" aria-hidden="true"></i>
              카테고리 등록
            </Link>
          </>
        }
      />

      <div className={heroOverlap}>
        <CategoryOrderTable categories={categories} />
        <p className="margin-top:3 font-size:caption color:text-muted">
          순서를 바꾸려면 표 위의 &lsquo;순서 변경&rsquo;을 누르세요. 메뉴가 있는 카테고리는 삭제할 수 없습니다. 먼저 메뉴를
          다른 카테고리로 옮기세요.
        </p>
      </div>
    </>
  );
}
