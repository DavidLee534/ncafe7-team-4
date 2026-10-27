// 재료 현황 — 기반 · 추가 재료 수와 숨긴 재료 수. 누르면 재료 목록(조건)으로 간다.
import Link from "next/link";
import type { AdminMain } from "@/lib/types";
import DetailCard from "../../_components/DetailCard";

export default function DashboardIngredients({ counts }: { counts: AdminMain["ingredients"] }) {
  const rows = [
    { label: "기반 재료", count: counts.base, href: "/admin/ingredients?type=base" },
    { label: "추가 재료", count: counts.extra, href: "/admin/ingredients?type=extra" },
  ];

  return (
    <DetailCard id="ingredients" title="🧪 재료 선반">
      <ul className="display:flex flex-direction:column gap:2">
        {rows.map((row) => (
          <li key={row.label} className="display:flex align-items:center justify-content:space-between">
            <Link href={row.href} className="font-weight:semibold">
              {row.label}
            </Link>
            <span className="color:text-muted">{row.count}개</span>
          </li>
        ))}
      </ul>
      <p className="margin-top:3 font-size:body-sm color:text-muted">
        {counts.hidden > 0
          ? `손님 선반에서 숨긴 재료가 ${counts.hidden}개 있다냥. 재고를 확인해 달라냥.`
          : "모든 재료가 선반에 올라가 있다냥."}
      </p>
      <Link href="/admin/ingredients" className="m3-btn btn:text btn-size:sm margin-top:3">
        재료 선반 전체 보기 →
      </Link>
    </DetailCard>
  );
}
