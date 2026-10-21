// 메뉴 상세 · 대표 이미지
import type { Menu } from "@/lib/types";
import DetailCard from "../../../../_components/DetailCard";

export default function MenuDetailImage({ menu }: { menu: Menu }) {
  return (
    <DetailCard id="image" title="대표 이미지">
      {menu.image ? (
        <img src={menu.image} alt={menu.korName} className="width:full border-radius:3 object-fit:cover" />
      ) : (
        <p className="color:text-muted">등록된 이미지가 없습니다.</p>
      )}
    </DetailCard>
  );
}
