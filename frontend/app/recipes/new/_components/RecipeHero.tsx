// 연금 공방 세 화면(재료로 · 감정으로 · 기본 메뉴)의 소개 영역과 방식 탭. 지금 화면의 탭은 채운 버튼으로 보인다.
import Link from "next/link";
import type { ReactNode } from "react";
import CatalogHero from "../../../_components/CatalogHero";

export type RecipeMode = "material" | "emotion" | "menu";

const modes: { key: RecipeMode; href: string; label: string }[] = [
  { key: "material", href: "/recipes/new", label: "⚗️ 재료로 만들기" },
  { key: "emotion", href: "/recipes/new/emotion", label: "💗 감정으로 만들기" },
  { key: "menu", href: "/recipes/new/from-menu", label: "☕ 기본 메뉴 고르기" },
];

export default function RecipeHero({ mode, title, description }: { mode: RecipeMode; title: ReactNode; description: ReactNode }) {
  return (
    <CatalogHero
      image="/images/moonlit-alchemy-workshop.png"
      kicker="🌙 MIDNIGHT ONLY · MOKA'S ALCHEMY WORKSHOP"
      title={title}
      description={description}
      notes={["⚗️ 연금솥 예열 완료", "📖 만든 포션은 도감에 기록돼요"]}
      actions={
        <nav aria-label="레시피 만드는 방식" style={{ display: "contents" }}>
          {modes.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`m3-btn btn-size:md ${item.key === mode ? "" : "btn:outlined"}`}
              aria-current={item.key === mode ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      }
    />
  );
}
