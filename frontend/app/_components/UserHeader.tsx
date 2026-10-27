"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cartCount, useCart } from "@/lib/cart";
import { useAuth } from "./AuthContext";
import styles from "./UserHeader.module.css";

const navigation = [
  { href: "/menus", label: "메뉴 책장" },
  { href: "/recipes/new", label: "연금 공방" },
  { href: "/my/recipes", label: "레시피 도감" },
  { href: "/potion-showcases", label: "포션 자랑" },
];

// 메뉴 책장은 상세(/menus/{slug})까지, 연금 공방은 하위 탭(/recipes/new/...)까지 켠다.
const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export default function UserHeader() {
  const pathname = usePathname();
  const { member, signOut } = useAuth();
  const cart = useCart();
  const count = cart ? cartCount(cart) : 0;
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="냥금술 공방 메인으로">
        <span aria-hidden="true">🐱</span><b>냥금술 공방</b>
      </Link>
      <nav className={styles.navigation} aria-label="사용자 메뉴">
        {navigation.map((item) => <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? styles.active : ""}>{item.label}</Link>)}
      </nav>
      <div className={styles.actions}>
        <Link href="/cart" className={`${styles.cart} ${pathname === "/cart" ? styles.cartActive : ""}`} aria-label={`장바구니 ${count}개`}>🛒 <span>장바구니</span> <b>{count}</b></Link>
        {member ? <><Link href="/my">{member.name} 님</Link><button type="button" className={styles.logout} onClick={signOut}>로그아웃</button></> : <><Link href="/login">로그인</Link><Link href="/signup" className={styles.signup}>회원가입</Link></>}
      </div>
    </header>
  );
}
