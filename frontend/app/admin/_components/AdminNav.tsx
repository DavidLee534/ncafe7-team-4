"use client";
// 관리자 왼쪽 메뉴 — 대시보드 · 메뉴 · 재료 · 카테고리 · 주문 · 회원 링크.
// 좁은 화면에서는 AdminShell 이 모달처럼 여닫는다.
import type { Ref } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminNav.module.css";

const SECTIONS = [
  {
    title: "오늘의 공방",
    mark: "✦",
    items: [{ href: "/admin", name: "공방 대시보드", icon: "🏮" }],
  },
  {
    title: "마법 레시피 보관함",
    mark: "✦",
    items: [
      { href: "/admin/menus", name: "메뉴 카탈로그", icon: "🐾" },
      { href: "/admin/menus/create", name: "마법 메뉴 등록", icon: "✨" },
    ],
  },
  {
    title: "재료 창고",
    mark: "✦",
    items: [
      { href: "/admin/ingredients", name: "재료 선반", icon: "🧪" },
      { href: "/admin/ingredients/create", name: "새 재료 등록", icon: "⚗️" },
      { href: "/admin/categories", name: "카테고리 관리", icon: "🧺" },
      { href: "/admin/categories/create", name: "새 재료 분류", icon: "➕" },
    ],
  },
  {
    title: "손님과 주문",
    mark: "✦",
    items: [
      { href: "/admin/orders", name: "주문 관리", icon: "🧾" },
      { href: "/admin/members", name: "회원 관리", icon: "🐱" },
    ],
  },
];

type Props = {
  ref?: Ref<HTMLElement>;
  id?: string;
  open?: boolean; // 좁은 화면에서 모달 메뉴가 열려 있는지
  closed?: boolean; // 좁은 화면에서 닫혀 있어 보이지 않는지. 이때는 Tab 포커스가 들어오지 않게 막는다
  onNavigate?: () => void; // 메뉴 링크를 누르면 (모달 메뉴 닫기)
};

export default function AdminNav({ ref, id, open = false, closed = false, onNavigate }: Props) {
  const pathname = usePathname();
  // 목록(/admin/menus)은 그 아래 상세·수정 화면(/admin/menus/1, /admin/menus/1/edit)에서도 켜 둔다.
  // 등록 화면은 따로 항목이 있으니 제외한다. 대시보드(/admin)는 모든 화면의 상위라서 정확히 같을 때만 켠다.
  const active = (href: string) => {
    if (pathname === href) return true;
    if (href === "/admin") return false;
    return pathname.startsWith(`${href}/`) && !pathname.endsWith("/create");
  };

  return (
    <nav
      ref={ref}
      id={id}
      className={`m3-nav-drawer layout-drawer ${styles.drawer} ${open ? styles.open : ""}`}
      aria-label="냥이 발자국 빵집 관리자 메뉴"
      inert={closed}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a[href]")) onNavigate?.();
      }}
    >
      <Link href="/admin" className={styles.brand}>
        <span className={styles.brandMoon} aria-hidden="true">🌙</span>
        <span className={styles.name}>냥이 발자국 빵집</span>
        <span className={styles.tagline}>MIDNIGHT BAKERY</span>
      </Link>

      <div className={styles.managerCard}>
        <span className={styles.managerCat} aria-hidden="true">🐱</span>
        <span>
          <b>모카 점장</b>
          <small><i aria-hidden="true" /> 야간 근무 중</small>
        </span>
        <span className={styles.managerPaw} aria-hidden="true">🐾</span>
      </div>

      <div className={styles.content}>
        {SECTIONS.map((section) => (
          <section key={section.title} className={styles.section}>
            <p className={styles.sectionTitle}><span aria-hidden="true">{section.mark}</span>{section.title}</p>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.item} ${active(item.href) ? styles.itemActive : ""}`}
                aria-current={active(item.href) ? "page" : undefined}
              >
                <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>
                <span>{item.name}</span>
                {active(item.href) && <span className={styles.activePaw} aria-hidden="true">🐾</span>}
              </Link>
            ))}
          </section>
        ))}

        <section className={styles.section}>
          <p className={styles.sectionTitle}><span aria-hidden="true">✦</span>공방 둘러보기</p>
          <Link href="/menu" className={styles.item}>
            <span className={styles.itemIcon} aria-hidden="true">🌙</span>
            <span>손님용 메뉴판</span>
          </Link>
        </section>
      </div>

      <div className={styles.ovenStatus}>
        <span aria-hidden="true">✨</span>
        <div><b>별가루 오븐</b><small>예열 완료 · 달콤한 주문을 기다려요</small></div>
      </div>
    </nav>
  );
}
