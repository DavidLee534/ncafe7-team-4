// 처리할 주문 — 접수·결제 완료 후 제조를 기다리는 주문. 오래 기다린 주문부터.
import Link from "next/link";
import type { AdminMain, AdminMainOrder } from "@/lib/types";
import { won } from "@/lib/format";
import DetailCard from "../../_components/DetailCard";
import OrderStatusBadge from "../../_components/OrderStatusBadge";

const PICKUP_TYPE: Record<string, string> = { "dine-in": "매장", takeout: "포장" };

export default function DashboardOrders({
  orders,
  counts,
}: {
  orders: AdminMainOrder[];
  counts: AdminMain["orders"];
}) {
  return (
    <DetailCard id="orders" title="🧾 처리할 주문">
      <p className="margin-bottom:3 font-size:body-sm color:text-muted">
        접수 완료 {counts.ordered}건 · 결제 완료 {counts.paid}건 · 제조 중 {counts.brewing}건 · 픽업 대기 {counts.ready}건
      </p>
      {orders.length === 0 ? (
        <p className="color:text-muted">기다리는 주문이 없다냥. 솥을 닦으며 쉬어도 된다냥.</p>
      ) : (
        <table className="m3-table">
          <thead>
            <tr>
              <th scope="col">주문번호</th>
              <th scope="col">상태</th>
              <th scope="col">픽업</th>
              <th scope="col" className="table-align:end">
                금액
              </th>
              <th scope="col">주문 시각</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-weight:semibold white-space:nowrap"><Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link></td>
                <td><OrderStatusBadge status={order.status} /></td>
                <td className="white-space:nowrap">
                  {order.pickupName}
                  <span className="font-size:caption color:text-muted"> · {PICKUP_TYPE[order.pickupType] ?? order.pickupType}</span>
                </td>
                <td className="table-align:end white-space:nowrap">{won(order.totalPrice)}</td>
                <td className="color:text-muted white-space:nowrap">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DetailCard>
  );
}
