// 관리자 방 — AdminShell(왼쪽 메뉴 + 본문). 상단 제목은 각 페이지의 AdminPageHeader(밤하늘 헤더)가 맡는다.
// 좁은 화면에서는 AdminShell 이 메뉴를 ☰ 버튼으로 여닫는 모달 메뉴로 바꾼다.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminShell from "./_components/AdminShell";

export const metadata: Metadata = { title: { default: "관리자", template: "%s - NCafe 관리자" } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
