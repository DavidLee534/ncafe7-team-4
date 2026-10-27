// 주문 상세 · 주문 정보 — 주문한 회원 · 상태 · 픽업 이름/방식 · 요청 사항
import { PICKUP_TYPE } from "@/lib/format";
import type { OrderDetail } from "@/lib/types";
import DetailCard from "../../../_components/DetailCard";
import OrderStatusBadge from "../../../_components/OrderStatusBadge";

export default function OrderDetailInfo({ order }: { order: OrderDetail }) {
  return (
    <DetailCard id="order" title="주문 정보">
      <table className="m3-table table:key-value">
        <tbody>
          <tr>
            <th scope="row">주문 회원</th>
            <td>{order.memberNickname}</td>
            <th scope="row">상태</th>
            <td>
              <OrderStatusBadge status={order.status} />
            </td>
          </tr>
          <tr>
            <th scope="row">픽업 이름</th>
            <td>{order.pickupName}</td>
            <th scope="row">픽업 방식</th>
            <td>{PICKUP_TYPE[order.pickupType] ?? order.pickupType}</td>
          </tr>
          <tr>
            <th scope="row">요청 사항</th>
            <td colSpan={3}>{order.request || "-"}</td>
          </tr>
        </tbody>
      </table>
    </DetailCard>
  );
}
