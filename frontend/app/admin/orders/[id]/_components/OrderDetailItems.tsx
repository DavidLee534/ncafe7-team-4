// 주문 상세 · 주문 항목 — 이름 · 재료 · 한 개 가격 · 수량 · 금액, 맨 아래 합계.
// 주문할 때 복사해 둔 값이라 메뉴가 바뀌거나 지워져도 그대로 보인다.
import { won } from "@/lib/format";
import type { OrderDetail } from "@/lib/types";
import DetailCard from "../../../_components/DetailCard";

export default function OrderDetailItems({ order }: { order: OrderDetail }) {
  return (
    <DetailCard id="items" title="주문 항목">
      <table className="m3-table">
        <thead>
          <tr>
            <th scope="col">항목</th>
            <th scope="col" className="table-align:end">
              가격
            </th>
            <th scope="col" className="table-align:end">
              수량
            </th>
            <th scope="col" className="table-align:end">
              금액
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>
                <span className="font-weight:semibold">{item.name}</span>
                {item.itemType === "recipe" && <span className="m3-badge badge:inline badge-color:secondary margin-left:2">포션</span>}
                {item.options && <p className="font-size:caption color:text-muted">{item.options.split(",").join(" · ")}</p>}
              </td>
              <td className="table-align:end">{won(item.unitPrice)}</td>
              <td className="table-align:end">{item.quantity}</td>
              <td className="table-align:end">{won(item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" colSpan={3} className="table-align:end">
              합계
            </th>
            <td className="table-align:end font-weight:bold">{won(order.totalPrice)}</td>
          </tr>
        </tbody>
      </table>
    </DetailCard>
  );
}
