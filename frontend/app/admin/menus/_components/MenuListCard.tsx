// 메뉴 카드 — 그림 · 코드 · 담당 바리스타 · 상태 · 이름 · 가격 · 수정/삭제.
// showActions={false} 이면 수정/삭제 줄을 뺀다 (예: 사장 추천 메뉴 칸).
import Link from "next/link";
import DeleteButton from "../../_components/DeleteButton";
import { MENU_STATUS, won } from "@/lib/format";
import { baristaOf, pawCode } from "@/lib/cat";
import type { Menu } from "@/lib/types";
import styles from "./MenuList.module.css";

type Props = { menu: Menu; categoryName: string; showActions?: boolean };

export default function MenuListCard({ menu, categoryName, showActions = true }: Props) {
  const status = MENU_STATUS[menu.status];
  const barista = baristaOf(menu);

  return (
    <li className={styles.card}>
      <Link href={`/admin/menus/${menu.id}`} className={styles.art} aria-label={`${menu.korName} 상세`}>
        {/* 메뉴 이미지는 크기 없는 SVG라 CSS가 늦게 들어와도 커지지 않게 크기를 직접 준다 */}
        {menu.image ? <img src={menu.image} alt="" width={116} height={116} /> : <span aria-hidden="true">☕</span>}
        <span className={styles.code}>{pawCode(menu.id)}</span>
        <span className={styles.barista} title={`담당 바리스타: ${barista.name}`}>
          {barista.icon}
        </span>
        <span className={`m3-badge badge:inline badge-color:${status.color} ${styles.status}`}>{status.label}</span>
      </Link>

      <div className={styles.body}>
        <p className={styles.category}>{categoryName}</p>
        <p className={styles.name}>
          {menu.korName}
          {menu.isNew && <span className="m3-badge badge:inline badge-color:primary margin-left:2">NEW</span>}
        </p>
        <p className={styles.eng}>{menu.engName}</p>
        <p className={styles.price}>{won(menu.price)}</p>
        <p className={styles.note}>담당 바리스타 {barista.name}</p>

        {showActions && (
          <div className={styles.foot}>
            <Link href={`/admin/menus/${menu.id}/edit`} className="m3-btn btn:text btn-size:xs">
              수정
            </Link>
            <DeleteButton
              path={`/api/v1/admin/menus/${menu.id}`}
              confirmMessage={`'${menu.korName}' 메뉴를 삭제할까요?`}
              className="m3-btn btn:text btn-color:danger btn-size:xs"
            >
              삭제
            </DeleteButton>
          </div>
        )}
      </div>
    </li>
  );
}
