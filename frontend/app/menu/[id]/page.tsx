import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserHeader from "../../_components/UserHeader";
import { basicMenuEffects, basicMenuId, basicMenuImage, basicMenus } from "../_components/alchemyMenus";
import { getCustomerMenu, getCustomerMenus } from "@/lib/customerMenuApi";
import MenuOrderBox from "./_components/MenuOrderBox";
import styles from "./MenuDetail.module.css";

export async function generateMetadata(props: PageProps<"/menu/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const menu = await getCustomerMenu(Number(id));
  return { title: menu?.korName ?? "메뉴" };
}

export default async function MenuDetailPage(props: PageProps<"/menu/[id]">) {
  const { id } = await props.params;
  const menu = await getCustomerMenu(Number(id));
  if (!menu) notFound();

  const basic = basicMenus.find(item => item.base === menu.korName);
  const name = basic?.name ?? menu.korName;
  const category = menu.categoryName ?? "기타";
  const siblings = (await getCustomerMenus()).filter(item => item.categoryId === menu.categoryId && item.id !== menu.id);
  const image = menu.imageUrl ?? (basic ? basicMenuImage(basicMenuId(basic)) : null);

  return <><UserHeader /><main className={styles.page}>
    <nav className={styles.crumb} aria-label="현재 위치"><Link href="/menu">메뉴 책장</Link><span aria-hidden="true">›</span><span>{category}</span><span aria-hidden="true">›</span><b>{name}</b></nav>

    <section className={styles.detail}>
      <div className={styles.art}>{image ? <img src={image} alt={`${menu.korName} 그림`} /> : <span aria-hidden="true">☕</span>}</div>
      <div className={styles.info}>
        <span className={styles.category}>{category} · {menu.status === "soldout" ? "품절" : "기본 포션"}</span>
        <h1>{name}</h1>
        {basic && <p className={styles.base}>{menu.korName}</p>}
        {basic && <div className={styles.badges}><b className={styles.grade}>일반</b>{basicMenuEffects(basic).map(effect => <b key={effect}>{effect}</b>)}</div>}
        <p className={styles.story}>{menu.description ?? basic?.description ?? ""}</p>
        {(menu.emotionTags.length > 0 || menu.tasteTags.length > 0) && <dl className={styles.tags}>
          <div><dt>어울리는 기분</dt><dd>{menu.emotionTags.map(emotion => <span key={emotion}>{emotion}</span>)}</dd></div>
          <div><dt>맛</dt><dd>{menu.tasteTags.map(taste => <span key={taste}>{taste}</span>)}</dd></div>
        </dl>}
        <MenuOrderBox menuId={menu.id} combineMenuId={basic ? basicMenuId(basic) : undefined} price={menu.price} available={menu.status === "on"} />
      </div>
    </section>

    {siblings.length > 0 && <section className={styles.siblings}>
      <h2>같은 {category} 책장의 포션</h2>
      <div>{siblings.map(other => <Link key={other.id} href={`/menu/${other.id}`}>
        {other.imageUrl ? <img src={other.imageUrl} alt="" /> : <span aria-hidden="true">☕</span>}
        <span><b>{basicMenus.find(item => item.base === other.korName)?.name ?? other.korName}</b><small>{other.korName}</small></span>
        <strong>{other.status === "soldout" ? "품절" : `${other.price.toLocaleString()}원`}</strong>
      </Link>)}</div>
    </section>}
  </main></>;
}
