// 관리자 홈(대시보드) — 밤하늘 헤더 · 현황 숫자 · 처리할 주문 · 손봐야 할 메뉴 · 카테고리별 메뉴 · 재료 선반 · 최근 수정.
// 데이터는 백엔드 GET /api/v1/admin 한 번으로 받는다. 세기·고르기는 백엔드가 하고, 페이지는 나눠 주기만 한다.
// (dashboard) 는 주소에 안 들어가는 폴더라 이 페이지의 주소는 /admin 이다.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../_components/AdminPageHeader";
import StatCard, { type Stat } from "../_components/StatCard";
import MokaMessage from "../../_components/MokaMessage";
import DashboardAttention from "./_components/DashboardAttention";
import DashboardCategories from "./_components/DashboardCategories";
import DashboardIngredients from "./_components/DashboardIngredients";
import DashboardOrders from "./_components/DashboardOrders";
import DashboardRecent from "./_components/DashboardRecent";
import { getAdminMain } from "@/lib/adminApi";
import { mokaReport } from "@/lib/cat";
import { won } from "@/lib/format";

export default async function AdminDashboardPage() {
  const main = await getAdminMain();

  const stats: Stat[] = [
    { label: "판매 중 메뉴", value: `${main.menus.on} / ${main.menus.all}` },
    { label: "처리할 주문", value: `${main.orders.paid}건` },
    { label: "오늘 매출", value: won(main.orders.todaySales) },
    { label: "회원", value: `${main.members.all}명` },
  ];

  return (
    <>
      <AdminPageHeader
        cat
        crumb="DASHBOARD"
        title="오늘의 공방"
        description={`모카 점장이 밤새 정리한 공방 현황이에요. 오늘 주문 ${main.orders.todayCount}건.`}
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
          <DashboardOrders orders={main.pendingOrders} counts={main.orders} />
          <DashboardAttention menus={main.attentionMenus} />
          <DashboardCategories categories={main.categories} />
        </div>
        <div className="display:flex flex-direction:column gap:5">
          <DashboardIngredients counts={main.ingredients} />
          <DashboardRecent menus={main.recentMenus} />
        </div>
      </div>

      <MokaMessage message={mokaReport(main.menus)} label="MOKA'S NIGHT REPORT" />
    </>
  );
}
