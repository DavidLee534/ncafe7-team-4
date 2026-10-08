"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./UserHeader.module.css";

const navigation = [
  { href: "/", label: "공방 이야기" },
  { href: "/menu", label: "메뉴 책장" },
  { href: "/menu/alchemy", label: "연금 공방" },
];

export default function UserHeader() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="냥금술 공방 메인으로">
        <span aria-hidden="true">🐱</span><b>냥금술 공방</b>
      </Link>
      <nav className={styles.navigation} aria-label="사용자 메뉴">
        {navigation.map((item) => <Link key={item.href} href={item.href} className={pathname === item.href ? styles.active : ""}>{item.label}</Link>)}
        <button type="button" title="준비 중인 기능입니다">레시피 도감</button>
        <button type="button" title="준비 중인 기능입니다">오늘의 추천</button>
      </nav>
      <div className={styles.actions}>
        <button type="button" title="준비 중인 기능입니다">마이페이지</button>
        <button type="button" className={styles.cart} title="장바구니 기능은 준비 중입니다">🛒 <span>장바구니</span> <b>0</b></button>
      </div>
    </header>
  );
}
