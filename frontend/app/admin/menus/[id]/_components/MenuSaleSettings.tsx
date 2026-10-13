// 메뉴 상세 · 판매 설정 — 판매 상태 · 신메뉴 표시
import type { Menu } from "@/lib/types";
import DetailCard from "../../../_components/DetailCard";
import MenuStatusBadge from "../../../_components/MenuStatusBadge";

export default function MenuSaleSettings({ menu }: { menu: Menu }) {
  return (
    <DetailCard id="sale" title="판매 설정">
      <table className="m3-table table:key-value">
        <tbody>
          <tr>
            <th scope="row">판매 상태</th>
            <td>
              <MenuStatusBadge status={menu.status} />
            </td>
            <th scope="row">신메뉴 표시</th>
            <td>{menu.isNew ? "예" : "아니오"}</td>
          </tr>
        </tbody>
      </table>
    </DetailCard>
  );
}
