"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import AlchemyModeLayout from "./AlchemyModeLayout";
import { basicMenuId, categoryIcons, type BasicMenu } from "./alchemyMenus";
import styles from "./EmotionAlchemyWorkshop.module.css";
import own from "./BasicMenuBoard.module.css";

export default function BasicMenuBoard({ menus: allMenus }: { menus: BasicMenu[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [addedName, setAddedName] = useState<string | null>(null);
  const menus = category ? allMenus.filter((menu) => menu.category === category) : allMenus;
  const categories = [...new Set(allMenus.map(menu => menu.category))];

  return <AlchemyModeLayout mode="basic" eyebrow="MOKA'S BASIC POTIONS" title="기본 메뉴" description={<>추가 재료 없이 <b>기반 재료</b>만으로 빚은 공방의 기본 포션이에요. 고민될 땐 여기서 바로 골라 장바구니에 담아 보세요.</>}>
    <nav className={own.filters} aria-label="계열 선택">
      <button type="button" className={category === null ? own.active : ""} onClick={() => setCategory(null)}>전체 <b>{allMenus.length}</b></button>
      {categories.map((name) => <button type="button" key={name} className={category === name ? own.active : ""} onClick={() => setCategory(name)}>{categoryIcons[name]} {name} <b>{allMenus.filter((menu) => menu.category === name).length}</b></button>)}
    </nav>
    <section className={own.grid} aria-label="기본 메뉴 목록">
      {menus.map((menu) => <article key={menu.name} className={own.card}>
        <div className={own.cardHead}><span aria-hidden="true">{categoryIcons[menu.category]}</span><small>{menu.category}</small></div>
        <h3><Link href={`/menu/${menu.id ?? basicMenuId(menu)}`}>{menu.name}</Link></h3>
        <p className={own.base}>{menu.base}</p>
        <p className={own.description}>{menu.description}</p>
        <div className={own.tags}>{menu.emotions.map((item) => <b key={item}>{item}</b>)}{menu.tastes.map((item) => <b key={item}>{item}</b>)}</div>
        <div className={own.footer}>
          <strong>{menu.price.toLocaleString()}원</strong>
          <button type="button" className={own.add} onClick={async () => { setAddedName(null); try { await addToCart({ name: menu.name, options: [menu.base], unitPrice: menu.price }); setAddedName(menu.name); } catch (error) { window.alert(error instanceof Error ? error.message : "담지 못했어요."); } }}>🛒 담기</button>
        </div>
        {addedName === menu.name && <p className={styles.added} role="status">담았어요! <Link href="/cart">장바구니 보기 →</Link></p>}
      </article>)}
    </section>
  </AlchemyModeLayout>;
}
