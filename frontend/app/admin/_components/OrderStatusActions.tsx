// 주문 상태 버튼 — 다음 단계(제조 시작 · 제조 완료 · 수령 완료)와 제조 전 취소.
// 수령 완료 · 취소된 주문은 더 바꿀 수 없어서 버튼이 없다. 목록의 줄과 상세 헤더에서 함께 쓴다.
import { ORDER_NEXT_STEP } from "@/lib/format";
import type { Order } from "@/lib/types";
import StatusChangeButton from "./StatusChangeButton";

type Props = {
  order: Pick<Order, "id" | "orderNumber" | "status">;
  size?: "xs" | "md"; // 목록은 xs, 상세 헤더는 md
};

export default function OrderStatusActions({ order, size = "xs" }: Props) {
  const next = ORDER_NEXT_STEP[order.status];
  const path = `/api/v1/admin/orders/${order.id}/status`;
  const btnSize = size === "xs" ? "btn-size:xs" : "";

  if (!next) return <span className="font-size:caption color:text-muted">처리 끝</span>;

  return (
    <>
      <StatusChangeButton
        path={path}
        status={next.status}
        confirmMessage={`${order.orderNumber} 주문을 '${next.label}'(으)로 넘길까요?`}
        className={`m3-btn ${btnSize}`}
      >
        {next.label}
      </StatusChangeButton>
      {(order.status === "ordered" || order.status === "paid") && (
        <StatusChangeButton
          path={path}
          status="cancelled"
          confirmMessage={`${order.orderNumber} 주문을 취소할까요? 취소한 주문은 되돌릴 수 없습니다.`}
          className={`m3-btn btn:outlined btn-color:danger ${btnSize}`}
        >
          취소
        </StatusChangeButton>
      )}
    </>
  );
}
