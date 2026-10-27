// 주문 상태 배지 — 결제 완료 / 제조 중 / 제조 완료 / 수령 완료 / 취소
import { ORDER_STATUS } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export default function OrderStatusBadge({ status, className = "" }: { status: OrderStatus; className?: string }) {
  const { color, label } = ORDER_STATUS[status] ?? { color: "neutral", label: status };
  return <span className={`m3-badge badge:inline badge-color:${color} ${className}`}>{label}</span>;
}
