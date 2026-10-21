// 메뉴 등록 — 밤하늘 헤더 · MenuForm.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import MenuForm from "../_components/MenuForm";
import { getMenuCategories } from "@/lib/adminApi";

export default async function AdminMenuCreatePage() {
  const categories = await getMenuCategories();

  return (
    <>
      <AdminPageHeader
        crumb="KITCHEN / NEW"
        title="메뉴 등록"
        description="새로운 메뉴 정보를 입력하고 등록합니다."
        actions={
          <>
            <Link href="/admin/menus" className="m3-btn btn:outlined">
              목록으로
            </Link>
          </>
        }
      />

      <div className={headerOverlap}>
        <MenuForm mode="create" categories={categories} cancelHref="/admin/menus" />
      </div>
    </>
  );
}
