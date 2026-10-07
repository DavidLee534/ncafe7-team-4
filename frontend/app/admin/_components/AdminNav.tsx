"use client";
// 관리자 내비 드로어 — 앱 셸(m3-layout)의 layout-drawer 슬롯. 현재 경로에 drawer-item-active.
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  {
    title: "메뉴 관리",
    items: [
      { href: "/admin/menus/list", name: "메뉴 목록", icon: "menu" },
      { href: "/admin/menus/create", name: "메뉴 등록", icon: "add" },
    ],
  },
  {
    title: "카테고리 관리",
    items: [
      { href: "/admin/categories/list", name: "카테고리 목록", icon: "folder" },
      { href: "/admin/categories/create", name: "카테고리 등록", icon: "add" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  // 등록 화면은 정확히 일치할 때만, 목록은 같은 묶음의 상세·수정 화면(/admin/menus/3 등)에서도 켠다.
  const active = (href: string) => {
    if (pathname === href) return true;
    if (!href.endsWith("/list")) return false;
    const base = href.slice(0, -"list".length);
    return pathname.startsWith(base) && !pathname.endsWith("/create");
  };
  return (
    <nav className="m3-nav-drawer layout-drawer" aria-label="관리자 메뉴">
      <div className="drawer-header">
        <Link href="/admin" className="drawer-headline">
          NCafe <span className="color:primary">Admin</span>
        </Link>
      </div>
      <div className="drawer-content">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <p className="drawer-section-header">{s.title}</p>
            {s.items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`drawer-item${active(it.href) ? " drawer-item-active" : ""}`}
                aria-current={active(it.href) ? "page" : undefined}
              >
                <i className={`m3-icon icon:${it.icon}`} aria-hidden="true"></i>
                <span className="drawer-label">{it.name}</span>
              </Link>
            ))}
          </div>
        ))}
        <p className="drawer-section-header">바로 가기</p>
        <Link href="/" className="drawer-item">
          <i className="m3-icon icon:arrow_back" aria-hidden="true"></i>
          <span className="drawer-label">사용자 사이트로</span>
        </Link>
      </div>
    </nav>
  );
}
