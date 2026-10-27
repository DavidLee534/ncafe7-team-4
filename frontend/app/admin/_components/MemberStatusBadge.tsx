// 회원 상태 배지 — 정상 / 정지
import { MEMBER_STATUS } from "@/lib/format";
import type { MemberStatus } from "@/lib/types";

export default function MemberStatusBadge({ status, className = "" }: { status: MemberStatus; className?: string }) {
  const { color, label } = MEMBER_STATUS[status] ?? { color: "neutral", label: status };
  return <span className={`m3-badge badge:inline badge-color:${color} ${className}`}>{label}</span>;
}
