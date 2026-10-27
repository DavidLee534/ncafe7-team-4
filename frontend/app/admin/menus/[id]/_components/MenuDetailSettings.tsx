// 메뉴 상세 · 판매 설정 — 판매 상태와 사장 추천
import type { Menu } from "@/lib/types";
import DetailCard from "../../../_components/DetailCard";
import MenuStatusBadge from "../../../_components/MenuStatusBadge";

export default function MenuDetailSettings({ menu }: { menu: Menu }) {
  return (
    <DetailCard id="sale" title="판매 설정">
      <table className="m3-table table:key-value">
        <tbody>
          <tr>
            <th scope="row">판매 상태</th>
            <td>
              <MenuStatusBadge status={menu.status} />
            </td>
          </tr>
          <tr>
            <th scope="row">사장 추천</th>
            <td>{menu.isRecommended ? "예" : "아니오"}</td>
          </tr>
        </tbody>
      </table>
    </DetailCard>
  );
}
