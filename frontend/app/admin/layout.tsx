// 관리자 방 — m3-layout (드로어 + 본문). 상단 제목은 각 페이지의 NightHero(밤하늘 헤더)가 맡는다.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminNav from "./_components/AdminNav";

export const metadata: Metadata = { title: { default: "관리자", template: "%s - NCafe 관리자" } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // 드로어 너비: 기본 22.5rem(360px)은 관리 화면에 넓어서 줄인다. 본문 왼쪽 여백도 이 값을 따른다.
    <div className="m3-layout layout:fixed-drawer" style={{ "--layout-drawer-width": "16rem" }}>
      <AdminNav />
      <div className="layout-main">
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
