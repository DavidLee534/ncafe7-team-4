"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cartCount, useCart } from "@/lib/cart";
import styles from "./UserHeader.module.css";

const navigation = [
  { href: "/menu", label: "메뉴 책장" },
  { href: "/menu/alchemy", label: "연금 공방" },
];

export default function UserHeader() {
  const pathname = usePathname();
  const cart = useCart();
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
        <Link href="/mypage">마이페이지</Link>
        <Link href="/login">로그인</Link>
        <Link href="/signup" className={styles.signup}>회원가입</Link>
        <Link href="/cart" className={styles.cart} aria-current={pathname === "/cart" ? "page" : undefined}>🛒 <span>장바구니</span> <b>{cart ? cartCount(cart) : 0}</b></Link>
      </div>
    </header>
  );
}
