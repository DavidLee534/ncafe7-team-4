// 첫 화면 — 사용자 화면을 만들기 전까지 관리자 화면으로 가는 링크만 둔다.
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="padding:8">
      <h1 className="font-size:heading-md font-weight:bold">NCafe</h1>
      <p className="margin-top:2 color:text-muted">사용자 화면은 준비 중입니다.</p>
      <Link href="/admin" className="m3-btn margin-top:5">
        관리자 화면으로
      </Link>
    </main>
  );
}
