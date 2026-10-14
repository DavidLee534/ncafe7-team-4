import Link from "next/link";
import type { ReactNode } from "react";
import UserHeader from "../../_components/UserHeader";
import styles from "./EmotionAlchemyWorkshop.module.css";

// 연금 공방 세 화면(재료 연금술 · 감정 연금술 · 기본 메뉴)이 함께 쓰는 머리말과 방식 탭.
export type AlchemyMode = "material" | "emotion" | "basic";

const modes: { key: AlchemyMode; href: string; label: ReactNode }[] = [
  { key: "material", href: "/menu/alchemy", label: "재료 연금술" },
  { key: "emotion", href: "/menu/alchemy/emotion", label: <>감정 연금술 <b>NEW</b></> },
  { key: "basic", href: "/menu/alchemy/basic", label: "기본 메뉴" },
];

export default function AlchemyModeLayout({ mode, eyebrow, title, description, children }: { mode: AlchemyMode; eyebrow: string; title: string; description: ReactNode; children: ReactNode }) {
  return <><UserHeader /><main className={styles.page}>
    <header className={styles.hero}><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></header>
    <nav className={styles.modeTabs} aria-label="연금술 방식">{modes.map((item) => item.key === mode ? <span key={item.key} className={styles.active} aria-current="page">{item.label}</span> : <Link key={item.key} href={item.href}>{item.label}</Link>)}</nav>
    {children}
  </main></>;
}
