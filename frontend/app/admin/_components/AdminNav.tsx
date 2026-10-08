"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminNav.module.css";

const SECTIONS = [
  {
    title: "마법 레시피 보관함",
    mark: "✦",
    items: [
      { href: "/admin/menus/list", name: "메뉴 카탈로그", icon: "🐾" },
      { href: "/admin/menus/create", name: "마법 메뉴 등록", icon: "✨" },
    ],
  },
  {
    title: "재료 창고",
    mark: "✦",
    items: [
      { href: "/admin/categories/list", name: "카테고리 관리", icon: "🧺" },
      { href: "/admin/categories/create", name: "새 재료 분류", icon: "➕" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const active = (href: string) => {
    if (pathname === href) return true;
    if (!href.endsWith("/list")) return false;
    const base = href.slice(0, -"list".length);
    return pathname.startsWith(base) && !pathname.endsWith("/create");
  };

  return (
    <nav className={`m3-nav-drawer layout-drawer ${styles.drawer}`} aria-label="냥이 발자국 빵집 관리자 메뉴">
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
