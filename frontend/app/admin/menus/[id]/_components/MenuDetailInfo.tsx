// 메뉴 상세 · 기본 정보 — 이름(한글/영문) · 카테고리 · 가격 · 설명
import { won } from "@/lib/format";
import type { Menu } from "@/lib/types";
import DetailCard from "../../../_components/DetailCard";

export default function MenuDetailInfo({ menu, categoryName }: { menu: Menu; categoryName: string }) {
  return (
    <DetailCard id="basic" title="기본 정보">
      <table className="m3-table table:key-value">
        <tbody>
          <tr>
            <th scope="row">메뉴명(한글)</th>
            <td>{menu.korName}</td>
            <th scope="row">메뉴명(영문)</th>
            <td>{menu.engName}</td>
          </tr>
          <tr>
            <th scope="row">카테고리</th>
            <td>{categoryName}</td>
            <th scope="row">가격</th>
            <td className="font-weight:bold">{won(menu.price)}</td>
          </tr>
          <tr>
            <th scope="row">설명</th>
            <td colSpan={3}>{menu.description || "-"}</td>
          </tr>
          <tr>
            <th scope="row">감정 태그</th>
            <td>{menu.emotionTags?.length ? menu.emotionTags.join(", ") : "-"}</td>
            <th scope="row">맛 태그</th>
            <td>{menu.tasteTags?.length ? menu.tasteTags.join(", ") : "-"}</td>
          </tr>
        </tbody>
      </table>
    </DetailCard>
  );
}
