// 메뉴 등록 — 밤하늘 헤더 · MenuForm.
import Link from "next/link";
import NightHero, { heroOverlap } from "../../_components/NightHero";
import MenuForm from "../_components/MenuForm";
import { getCategories } from "@/lib/mock";

export default function AdminMenuCreatePage() {
  return (
    <>
      <NightHero
        crumb="KITCHEN / NEW"
        title="메뉴 등록"
        description="새로운 메뉴 정보를 입력하고 등록합니다."
        actions={
          <>
            <Link href="/admin/menus/list" className="m3-btn btn:outlined">
              목록으로
            </Link>
          </>
        }
      />

      <div className={heroOverlap}>
        <MenuForm mode="create" categories={getCategories()} cancelHref="/admin/menus/list" />
      </div>
    </>
  );
}
