// 관리자 홈 — 대시보드를 만들기 전까지 메뉴 목록으로 보낸다.
import { redirect } from "next/navigation";

export default function AdminHomePage() {
  redirect("/admin/menus/list");
}
