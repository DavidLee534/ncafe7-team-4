// 주문 목록 — 밤하늘 헤더 · 현황 숫자 · 상태 칩/검색 · 주문 표. 데이터는 백엔드에서 받는다.
// 필터는 주소의 쿼리(?status=ordered&keyword=모카&sort=oldest)로 받아 백엔드 검색 조건으로 넘긴다.
// 거르기·세기·정렬은 백엔드가 하고, 페이지는 받아서 나눠 준다.
//   현황 숫자 · 상태 칩의 개수 → summary, 표 → 목록 API + 조건
import AdminPageHeader, { headerOverlap } from "../_components/AdminPageHeader";
import StatCard, { type Stat } from "../_components/StatCard";
import OrderListFilters from "./_components/OrderListFilters";
import OrderListTable from "./_components/OrderListTable";
import { getOrders, getOrderSummary } from "@/lib/adminApi";
import { ORDER_STATUS, won } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AdminOrderListPage(props: PageProps<"/admin/orders">) {
  // 1. 주소의 검색 조건
  const searchParams = await props.searchParams;
  const status = one(searchParams.status);
  const keyword = one(searchParams.keyword);
  const sort = one(searchParams.sort);

  // 2. 화면에 필요한 데이터
  const [summary, orders] = await Promise.all([
    getOrderSummary(),
    getOrders({
      status: status in ORDER_STATUS ? (status as OrderStatus) : undefined,
      keyword,
      sort: sort === "oldest" ? "oldest" : undefined,
    }),
  ]);
  const stats: Stat[] = [
    { label: "오늘 접수 금액", value: won(summary.todayOrderAmount) },
    { label: "제조 대기", value: `${summary.ordered + summary.paid}건` },
    { label: "제조 중", value: `${summary.brewing}건` },
    { label: "픽업 대기 (제조 완료)", value: `${summary.ready}건` },
  ];

  // 3. 배치
  return (
    <>
      <AdminPageHeader
        crumb="ORDERS"
        title="주문 관리"
        description="접수된 주문을 보고 제조 상태를 한 단계씩 넘깁니다. 접수 완료 → 제조 중 → 제조 완료 → 수령 완료"
      />

      <ul className={`m3-grid grid-cols:4 grid-gap:3 ${headerOverlap}`}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </ul>

      <OrderListFilters summary={summary} status={status} keyword={keyword} sort={sort} orderCount={orders.length} />
      <OrderListTable orders={orders} />
    </>
  );
}
