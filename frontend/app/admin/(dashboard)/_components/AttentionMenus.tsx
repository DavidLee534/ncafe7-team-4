// 손봐야 할 메뉴 — 품절 · 비공개 메뉴를 모아서 바로 수정하러 갈 수 있게 한다.
import Link from "next/link";
import type { Menu } from "@/lib/types";
import DetailCard from "../../_components/DetailCard";
import MenuStatusBadge from "../../_components/MenuStatusBadge";

export default function AttentionMenus({ menus }: { menus: Menu[] }) {
  return (
    <DetailCard id="attention" title="🐟 손봐야 할 메뉴">
      {menus.length === 0 ? (
        <p className="color:text-muted">모든 메뉴가 판매 중이다냥. 오늘은 낮잠을 자도 된다냥.</p>
      ) : (
        <table className="m3-table">
          <thead>
            <tr>
              <th scope="col">메뉴</th>
              <th scope="col">상태</th>
              <th scope="col">마지막 수정</th>
              <th scope="col">관리</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id}>
                <td>
                  <Link href={`/admin/menus/${menu.id}`} className="font-weight:semibold">
                    {menu.korName}
                  </Link>
                </td>
                <td>
                  <MenuStatusBadge status={menu.status} />
                </td>
                <td className="color:text-muted">{menu.updatedAt}</td>
                <td>
                  <Link href={`/admin/menus/${menu.id}/edit`} className="m3-btn btn:text btn-size:xs">
                    수정
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DetailCard>
  );
}
