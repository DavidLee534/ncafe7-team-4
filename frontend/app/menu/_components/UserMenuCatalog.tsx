"use client";
import Link from "next/link";
import { useState } from "react";
import { getCategories, getMenus } from "@/lib/mock";
import MokaMessage from "../../admin/menus/_components/MokaMessage";
import RecipeBook from "./RecipeBook";
import styles from "./UserMenuCatalog.module.css";
import UserHeader from "../../_components/UserHeader";
export default function UserMenuCatalog() {
  const [categoryId,setCategoryId]=useState<number|null>(null); const categories=getCategories(); const allMenus=getMenus().filter(m=>m.status!=="hidden"); const menus=categoryId?allMenus.filter(m=>m.categoryId===categoryId):allMenus; const categoryName=categories.find(c=>c.id===categoryId)?.name; const on=menus.filter(m=>m.status==="on").length; const soldout=menus.filter(m=>m.status==="soldout").length;
  return <><UserHeader /><main className={styles.page}><header className={styles.hero}><span>🌙 MOKA&apos;S MIDNIGHT MENU ARCHIVE</span><h1>모카 점장의<br/><em>비밀 메뉴 책장</em></h1><p>달빛 공방에서 구운 메뉴를 골라 보세요. 직접 나만의 주문을 만들고 싶다면 연금 공방으로 놀러 와요냥.</p><Link href="/menu/alchemy" className={styles.alchemyLink}>🪄 나만의 포션 조합하기</Link></header><section className={styles.catalog}><div className={styles.heading}><div><span>PAW-APPROVED CATALOG</span><h2>공방에서 준비한 메뉴</h2></div><p>{menus.length}개의 메뉴가 있어요.</p></div><nav className={styles.filters}><button type="button" className={!categoryId?styles.active:""} onClick={()=>setCategoryId(null)}>전체 <b>{allMenus.length}</b></button>{categories.map(c=><button type="button" key={c.id} className={categoryId===c.id?styles.active:""} onClick={()=>setCategoryId(c.id)}>{c.name} <b>{allMenus.filter(m=>m.categoryId===c.id).length}</b></button>)}</nav><RecipeBook key={categoryId??"all"} menus={menus} overview/></section><MokaMessage message={categoryName?`${categoryName} 책장에는 판매 가능한 메뉴가 ${on}개, 품절 메뉴가 ${soldout}개 있어요냥.`:`오늘 공방에는 판매 가능한 메뉴가 ${on}개, 품절 메뉴가 ${soldout}개 있어요냥.`}/></main></>;
}
