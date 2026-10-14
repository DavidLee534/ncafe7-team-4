"use client";
import Link from "next/link";
import { useState } from "react";
import type { Menu } from "@/lib/types";
import MokaMessage from "../../_components/MokaMessage";
import RecipeBook from "../../_components/RecipeBook";
import styles from "./UserMenuCatalog.module.css";
import UserHeader from "../../_components/UserHeader";
import { getMenuLore } from "../../_components/menuLore";
import { basicMenuCategories, basicMenuImage, basicMenus } from "./alchemyMenus";

// 메뉴 책장은 연금 공방의 기본 메뉴 30종을 보여 준다. 기본 이름으로 menuLore 를 찾아 연금술 이름·효과를 붙인다.
const BASIC_CATEGORIES = basicMenuCategories.map((name, index) => ({ id: index + 1, name }));
const BASIC_MENUS: Menu[] = basicMenus.map((menu, index) => ({
  id: index + 1,
  korName: menu.base,
  engName: menu.name,
  categoryId: basicMenuCategories.indexOf(menu.category) + 1,
  price: menu.price,
  description: menu.description,
  image: basicMenuImage(index + 1),
  status: "on",
  isNew: false,
  createdAt: "",
  updatedAt: "",
}));
export default function UserMenuCatalog() {
  const [categoryId,setCategoryId]=useState<number|null>(null); const categories=BASIC_CATEGORIES; const allMenus=BASIC_MENUS; const menus=categoryId?allMenus.filter(m=>m.categoryId===categoryId):allMenus; const categoryName=categories.find(c=>c.id===categoryId)?.name; const on=menus.filter(m=>m.status==="on").length; const soldout=menus.filter(m=>m.status==="soldout").length; const pick=allMenus.find(m=>m.status==="on") ?? allMenus[0]; const pickLore=pick&&getMenuLore(pick);
  return <><UserHeader /><main className={styles.page}><header className={styles.hero}><span>🌙 MOKA&apos;S MIDNIGHT MENU ARCHIVE</span><h1>모카 점장의<br/><em>비밀 메뉴 책장</em></h1><p>달빛 공방에서 구운 메뉴를 골라 보세요. 직접 나만의 주문을 만들고 싶다면 연금 공방으로 놀러 와요냥.</p><Link href="/menu/alchemy" className={styles.alchemyLink}>🪄 나만의 포션 조합하기</Link></header><section className={styles.catalog}><div className={styles.heading}><div><span>PAW-APPROVED CATALOG</span><h2>공방에서 준비한 메뉴</h2></div><p>{menus.length}개의 메뉴가 있어요.</p></div>{pick&&<article className={styles.todayPick}><div className={styles.pickArt}>{pick.image?<img src={pick.image} alt=""/>:"✨"}</div><div><span>🐱 MOKA&apos;S TODAY PICK</span><h3>{pickLore?.magicName??pick.korName}</h3><p>{pick.korName} · {pickLore?.effects.join(" · ")??"오늘의 달콤한 추천"}</p></div><strong>{pickLore?.grade??"일반"}</strong></article>}<nav className={styles.filters}><button type="button" className={!categoryId?styles.active:""} onClick={()=>setCategoryId(null)}>전체 <b>{allMenus.length}</b></button>{categories.map(c=><button type="button" key={c.id} className={categoryId===c.id?styles.active:""} onClick={()=>setCategoryId(c.id)}>{c.name} <b>{allMenus.filter(m=>m.categoryId===c.id).length}</b></button>)}</nav><RecipeBook key={categoryId??"all"} menus={menus} overview customer/></section><MokaMessage message={categoryName?`${categoryName} 책장에는 판매 가능한 메뉴가 ${on}개, 품절 메뉴가 ${soldout}개 있어요냥.`:`오늘 공방에는 판매 가능한 메뉴가 ${on}개, 품절 메뉴가 ${soldout}개 있어요냥.`}/></main></>;
}
