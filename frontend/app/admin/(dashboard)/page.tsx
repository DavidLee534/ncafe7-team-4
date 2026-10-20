// 관리자 홈(대시보드) — 밤하늘 헤더 · 현황 숫자 · 손봐야 할 메뉴 · 카테고리별 메뉴 · 최근 수정. 데이터는 백엔드에서 받는다.
// (dashboard) 는 주소에 안 들어가는 폴더라 이 페이지의 주소는 /admin 이다.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../_components/AdminPageHeader";
import StatCard, { type Stat } from "../_components/StatCard";
import MokaMessage from "../../_components/MokaMessage";
import DashboardAttention from "./_components/DashboardAttention";
import DashboardCategories from "./_components/DashboardCategories";
import DashboardRecent from "./_components/DashboardRecent";
import { countMenusByStatus, getCategories, getMenus } from "@/lib/adminApi";
import { mokaReport, recentlyUpdated } from "@/lib/cat";

export default async function AdminDashboardPage() {
  const [menus, categories] = await Promise.all([getMenus(), getCategories()]);
  const counts = countMenusByStatus(menus);
  const visibleCategories = categories.filter((item) => item.visible).length;

  const stats: Stat[] = [
    { label: "전체 메뉴", value: `${counts.all}개` },
    { label: "판매 중", value: `${counts.on}개` },
    { label: "품절 · 비공개", value: `${counts.soldout + counts.hidden}개` },
    { label: "공개 카테고리", value: `${visibleCategories} / ${categories.length}` },
  ];
  const attention = menus.filter((menu) => menu.status !== "on");
  const shelf = categories.map((category) => ({ category, count: category.menuCount }));

  return (
    <>
      <AdminPageHeader
        cat
        crumb="DASHBOARD"
        title="오늘의 공방"
        description="모카 점장이 밤새 정리한 메뉴와 카테고리 현황이에요."
        actions={
          <>
            <Link href="/menu" className="m3-btn btn:outlined">
              손님용 메뉴판
            </Link>
            <Link href="/admin/menus/create" className="m3-btn btn-icon:leading">
              <i className="m3-icon icon:add" aria-hidden="true"></i>
              마법 메뉴 등록
            </Link>
          </>
        }
      />

      <ul className={`m3-grid grid-cols:4 grid-gap:3 margin-bottom:6 ${headerOverlap}`}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </ul>

      <div
        className="display:grid grid-template-columns:1 gap:5 md:grid-template-columns:ex align-items:start"
        style={{ "--grid-template-columns-ex": "minmax(0, 3fr) minmax(0, 2fr)" }}
      >
        <div className="display:flex flex-direction:column gap:5">
          <DashboardAttention menus={attention} />
          <DashboardCategories rows={shelf} />
        </div>
        <DashboardRecent menus={recentlyUpdated(menus)} />
      </div>

      <MokaMessage message={mokaReport(menus)} label="MOKA'S NIGHT REPORT" />
    </>
  );
}
