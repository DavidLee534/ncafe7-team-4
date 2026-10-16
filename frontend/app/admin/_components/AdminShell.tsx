"use client";
// 관리자 화면 틀 — 넓은 화면은 왼쪽 고정 메뉴, 좁은 화면(1024px 이하)은 위쪽 바의 ☰ 버튼으로 여닫는 모달 메뉴.
// 모달 메뉴는 바깥(어두운 막) · Esc · 메뉴 항목을 누르면 닫히고, 열려 있는 동안 뒤 화면은 스크롤되지 않는다.
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import AdminNav from "./AdminNav";
import styles from "./AdminShell.module.css";

const COMPACT_QUERY = "(max-width: 1024px)";

function subscribeCompact(onChange: () => void) {
  const query = window.matchMedia(COMPACT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// 서버에서 그릴 때는 넓은 화면으로 보고, 브라우저에서 실제 폭을 읽는다
function useCompact() {
  return useSyncExternalStore(subscribeCompact, () => window.matchMedia(COMPACT_QUERY).matches, () => false);
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const compact = useCompact();
  const [open, setOpen] = useState(false);
  const menuOpen = compact && open; // 넓어지면 고정 메뉴라서 열림 상태는 의미가 없다
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  function closeMenu() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  // 열리면 메뉴 첫 링크로 포커스를 옮기고, Esc 로 닫고, 뒤 화면 스크롤을 막는다
  useEffect(() => {
    if (!menuOpen) return;
    navRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    // 드로어 너비: 기본 22.5rem(360px)은 관리 화면에 넓어서 줄인다. 본문 왼쪽 여백도 이 값을 따른다.
    <div className={`m3-layout layout:fixed-drawer ${styles.shell}`} style={{ "--layout-drawer-width": "16rem" }}>
      <AdminNav
        ref={navRef}
        id="admin-nav"
        open={menuOpen}
        closed={compact && !open}
        onNavigate={() => setOpen(false)}
      />
      {menuOpen && <div className={styles.scrim} onClick={closeMenu} aria-hidden="true" />}
      <div className="layout-main">
        <header className={styles.topBar}>
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="admin-nav"
            aria-label={menuOpen ? "관리자 메뉴 닫기" : "관리자 메뉴 열기"}
            onClick={() => (menuOpen ? closeMenu() : setOpen(true))}
          >
            <i className="m3-icon icon:menu" aria-hidden="true"></i>
          </button>
          <span className={styles.title}>🌙 냥이 발자국 빵집 관리자</span>
        </header>
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
