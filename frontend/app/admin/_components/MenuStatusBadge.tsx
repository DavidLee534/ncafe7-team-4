// 판매 상태 배지 — 판매 중 / 품절 / 비공개
import { MENU_STATUS } from "@/lib/format";
import type { MenuStatus } from "@/lib/types";

export default function MenuStatusBadge({ status, className = "" }: { status: MenuStatus; className?: string }) {
  const { color, label } = MENU_STATUS[status];
  return <span className={`m3-badge badge:inline badge-color:${color} ${className}`}>{label}</span>;
}
