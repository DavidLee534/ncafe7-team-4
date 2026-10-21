// 모카 점장의 발자국 — 최근에 등록 · 수정된 메뉴
import Link from "next/link";
import type { Menu } from "@/lib/types";
import DetailCard from "../../_components/DetailCard";
import styles from "./Dashboard.module.css";

export default function DashboardRecent({ menus }: { menus: Menu[] }) {
  return (
    <DetailCard id="recent" title="🐾 모카 점장의 발자국">
      <ol className={styles.log}>
        {menus.map((menu) => (
          <li key={menu.id}>
            <span className={styles.logDate}>{menu.updatedAt}</span>
            <Link href={`/admin/menus/${menu.id}`} className="font-weight:semibold">
              {menu.korName}
            </Link>
            <span className="font-size:body-sm color:text-muted">
              {menu.createdAt === menu.updatedAt ? "새 메뉴에 발도장을 남겼어요." : "메뉴 정보를 다시 살펴봤어요."}
            </span>
          </li>
        ))}
      </ol>
      <Link href="/admin/menus" className="m3-btn btn:text btn-size:sm margin-top:3">
        메뉴 카탈로그 전체 보기 →
      </Link>
    </DetailCard>
  );
}
