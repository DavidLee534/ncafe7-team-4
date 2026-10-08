// 메뉴 수정 — 밤하늘 헤더 · MenuForm(기존 값). 없는 id면 404.
import Link from "next/link";
import NightHero, { heroOverlap } from "../../../_components/NightHero";
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
      <NightHero
        crumb="KITCHEN / EDIT"
        title="메뉴 수정"
        description={<>메뉴 번호 #{menu.id} · 마지막 수정 {menu.updatedAt}</>}
        actions={
          <>
            <Link href={detailHref} className="m3-btn btn:outlined">
              상세로 돌아가기
            </Link>
          </>
        }
      />

      <div className={heroOverlap}>
        <MenuForm mode="edit" initial={menu} categories={getCategories()} cancelHref={detailHref} />
      </div>
    </>
  );
}
