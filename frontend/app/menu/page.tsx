import Link from "next/link";
import RecipeBook from "./_components/RecipeBook";
import { getMenus } from "@/lib/mock";

export default function CustomerMenuPage() {
  const menus = getMenus({ status: "on" });

  return (
    <main className="menu-page">
      <Link href="/" className="menu-home-link">← 빵집 입구로 돌아가기</Link>
      <header className="menu-intro">
        <span>🌙 MOKA&apos;S MIDNIGHT COLLECTION</span>
        <h1>비밀 레시피북</h1>
        <p>모카 점장이 달빛 아래에서만 펼치는, 오늘의 달콤한 주문이에요.</p>
      </header>
      <RecipeBook menus={menus} />
    </main>
  );
}
