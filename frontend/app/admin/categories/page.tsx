// 카테고리 목록 — 밤하늘 헤더 · 표(순서 바꾸기·이름·메뉴 수·공개 여부). 데이터는 백엔드에서 받는다.
// 페이지는 카테고리와 메뉴 수를 준비하고, 순서 변경 모드는 CategoryListTable 이 맡는다.
// 메뉴가 남아 있는 카테고리는 삭제할 수 없게 버튼을 막는다.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../_components/AdminPageHeader";
import CategoryListTable from "./_components/CategoryListTable";
import { getCategories } from "@/lib/adminApi";

export default async function AdminCategoryListPage() {
  const categories = await getCategories();

  return (
    <>
      <AdminPageHeader
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

      <div className={headerOverlap}>
        {/* 표는 받은 목록을 자기 상태로 들고 있어서, 삭제·수정 뒤 새 목록이 오면 key 로 다시 만든다 */}
        <CategoryListTable
          key={categories.map((c) => `${c.id}:${c.sortOrder}:${c.name}:${c.visible}:${c.menuCount}`).join(",")}
          categories={categories}
        />
        <p className="margin-top:3 font-size:caption color:text-muted">
          순서를 바꾸려면 표 위의 &lsquo;순서 변경&rsquo;을 누르세요. 메뉴가 있는 카테고리는 삭제할 수 없습니다. 먼저 메뉴를
          다른 카테고리로 옮기세요.
        </p>
      </div>
    </>
  );
}
