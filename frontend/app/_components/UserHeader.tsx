"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cartCount, useCart } from "@/lib/cart";
import styles from "./UserHeader.module.css";

const navigation = [
  { href: "/menu", label: "메뉴 책장" },
  { href: "/menu/alchemy", label: "연금 공방" },
];

// 메뉴 책장은 상세(/menu/3)까지, 연금 공방은 하위 탭(/menu/alchemy/...)까지 켠다.
const isActive = (pathname: string, href: string) =>
  pathname === href || (href === "/menu" ? /^\/menu\/\d+$/.test(pathname) : pathname.startsWith(`${href}/`));

export default function UserHeader() {
  const pathname = usePathname();
  const count = cartCount(useCart());
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="냥금술 공방 메인으로">
        <span aria-hidden="true">🐱</span><b>냥금술 공방</b>
      </Link>
      <nav className={styles.navigation} aria-label="사용자 메뉴">
        {navigation.map((item) => <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? styles.active : ""}>{item.label}</Link>)}
        <button type="button" title="준비 중인 기능입니다">레시피 도감</button>
        <button type="button" title="준비 중인 기능입니다">오늘의 추천</button>
      </nav>
      <div className={styles.actions}>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/login">로그인</Link>
        <Link href="/signup" className={styles.signup}>회원가입</Link>
        <Link href="/cart" className={`${styles.cart} ${pathname === "/cart" ? styles.cartActive : ""}`} aria-label={`장바구니 ${count}개`}>🛒 <span>장바구니</span> <b>{count}</b></Link>
      </div>
    </header>
  );
}
