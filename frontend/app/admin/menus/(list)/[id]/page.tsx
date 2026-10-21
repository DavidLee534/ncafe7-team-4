// 메뉴 상세 — 밤하늘 헤더(이름·상태·동작) · 기본 정보/판매 설정 · 대표 이미지. 없는 id면 404.
// 페이지는 데이터를 준비해서 배치만 하고, 각 칸은 받은 값을 보여주기만 한다.
import { notFound } from "next/navigation";
import AdminPageHeader, { headerOverlap } from "../../../_components/AdminPageHeader";
import MenuDetailInfo from "./_components/MenuDetailInfo";
import MenuDetailActions from "./_components/MenuDetailActions";
import MenuDetailImage from "./_components/MenuDetailImage";
import MenuDetailSettings from "./_components/MenuDetailSettings";
import MenuStatusBadge from "../../../_components/MenuStatusBadge";
import { getCategory, getMenu } from "@/lib/adminApi";
import { baristaOf, pawCode } from "@/lib/cat";

export default async function AdminMenuDetailPage(props: PageProps<"/admin/menus/[id]">) {
  const { id } = await props.params;
  const menu = await getMenu(Number(id));
  if (!menu) notFound();
  const categoryName = (await getCategory(menu.categoryId))?.name ?? "-";
  const barista = baristaOf(menu);

  return (
    <>
      <AdminPageHeader
        crumb={`KITCHEN / ${pawCode(menu.id)}`}
        title={
          <>
            {menu.korName} <MenuStatusBadge status={menu.status} className="vertical-align:middle" />
          </>
        }
        description={`메뉴 번호 #${menu.id} · ${menu.createdAt} 등록 · ${menu.updatedAt} 수정 · 담당 바리스타 ${barista.icon} ${barista.name}`}
        actions={<MenuDetailActions menu={menu} />}
      />

      <div
        className={`display:grid grid-template-columns:1 gap:5 md:grid-template-columns:ex align-items:start ${headerOverlap}`}
        style={{ "--grid-template-columns-ex": "minmax(0, 2fr) minmax(0, 1fr)" }}
      >
        <div className="display:flex flex-direction:column gap:5">
          <MenuDetailInfo menu={menu} categoryName={categoryName} />
          <MenuDetailSettings menu={menu} />
        </div>
        <MenuDetailImage menu={menu} />
      </div>
    </>
  );
}
