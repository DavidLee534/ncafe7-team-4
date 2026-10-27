// 주문 상세 · 결제 정보 — 결제 수단 · 내용 · 금액 · 승인번호 · 결제 시각. 결제 기록이 없으면 안내만.
import { PAYMENT_METHOD, won } from "@/lib/format";
import type { OrderDetail } from "@/lib/types";
import DetailCard from "../../../_components/DetailCard";

export default function OrderDetailPayment({ payment, status }: { payment: OrderDetail["payment"]; status: OrderDetail["status"] }) {
  return (
    <DetailCard id="payment" title="결제 정보">
      {payment ? (
        <table className="m3-table table:key-value">
          <tbody>
            <tr>
              <th scope="row">결제 수단</th>
              <td>{PAYMENT_METHOD[payment.method] ?? payment.method}</td>
            </tr>
            <tr>
              <th scope="row">결제 내용</th>
              <td>{payment.detail || "-"}</td>
            </tr>
            <tr>
              <th scope="row">결제 금액</th>
              <td className="font-weight:bold">{won(payment.amount)}</td>
            </tr>
            <tr>
              <th scope="row">승인번호</th>
              <td>{payment.approvalCode}</td>
            </tr>
            <tr>
              <th scope="row">결제 시각</th>
              <td>{payment.paidAt}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="color:text-muted">{status === "ordered" ? "현장 결제 예정입니다. 아직 결제 기록이 없습니다." : "결제 기록이 없습니다."}</p>
      )}
    </DetailCard>
  );
}
