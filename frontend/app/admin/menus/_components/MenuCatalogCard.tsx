// 메뉴 캣탈로그 카드 — 그림 · 코드 · 담당 바리스타 · 상태 · 이름 · 가격 · 수정/삭제.
import Link from "next/link";
import MockActionButton from "../../_components/MockActionButton";
import { MENU_STATUS, won } from "@/lib/format";
import { baristaOf, pawCode } from "@/lib/cat";
import type { Menu } from "@/lib/types";
import styles from "./MenuCatalog.module.css";

export default function MenuCatalogCard({ menu, categoryName }: { menu: Menu; categoryName: string }) {
  const status = MENU_STATUS[menu.status];
  const barista = baristaOf(menu);

  return (
    <li className={styles.card}>
      <Link href={`/admin/menus/${menu.id}`} className={styles.art} aria-label={`${menu.korName} 상세`}>
        {menu.image ? <img src={menu.image} alt="" /> : <span aria-hidden="true">☕</span>}
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

        <div className={styles.foot}>
          <Link href={`/admin/menus/${menu.id}/edit`} className="m3-btn btn:text btn-size:xs">
            수정
          </Link>
          <MockActionButton
            confirmMessage={`'${menu.korName}' 메뉴를 삭제할까요?`}
            className="m3-btn btn:text btn-color:danger btn-size:xs"
          >
            삭제
          </MockActionButton>
        </div>
      </div>
    </li>
  );
}
