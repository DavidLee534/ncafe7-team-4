// 주문 표 — 주문번호 · 상태 · 픽업 · 잔 수 · 금액 · 주문 시각 · 상태 변경. 주문번호를 누르면 상세로 간다.
// 조건에 맞는 주문이 없으면 안내를 보여 준다.
import Link from "next/link";
import OrderStatusActions from "../../_components/OrderStatusActions";
import OrderStatusBadge from "../../_components/OrderStatusBadge";
import { PICKUP_TYPE, won } from "@/lib/format";
import type { Order } from "@/lib/types";
import styles from "../../_components/AdminList.module.css";

export default function OrderListTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <section className="m3-card card:outlined" aria-label="주문 표">
        <div className={styles.empty}>
          <span aria-hidden="true">🧾</span>
          <h3>조건에 맞는 주문이 없어요.</h3>
          <p>상태나 검색어를 바꿔 보세요.</p>
          <Link href="/admin/orders">전체 주문 보기</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`m3-card card:outlined ${styles.tableWrap}`} aria-label="주문 표">
      <table className="m3-table">
        <thead>
          <tr>
            <th scope="col">주문번호</th>
            <th scope="col">상태</th>
            <th scope="col">픽업</th>
            <th scope="col" className="table-align:end">
              잔 수
            </th>
            <th scope="col" className="table-align:end">
              금액
            </th>
            <th scope="col">주문 시각</th>
            <th scope="col">제조 상태 변경</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={`/admin/orders/${order.id}`} className={`color:link ${styles.mono}`}>
                  {order.orderNumber}
                </Link>
              </td>
              <td>
                <OrderStatusBadge status={order.status} />
              </td>
              <td>
                <span className="font-weight:semibold">{order.pickupName}</span>
                <p className="font-size:caption color:text-muted">{PICKUP_TYPE[order.pickupType] ?? order.pickupType}</p>
              </td>
              <td className="table-align:end">{order.itemCount}잔</td>
              <td className="table-align:end font-weight:semibold">{won(order.totalPrice)}</td>
              <td className="color:text-muted">{order.createdAt}</td>
              <td>
                <div className="display:flex gap:1">
                  <OrderStatusActions order={order} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
