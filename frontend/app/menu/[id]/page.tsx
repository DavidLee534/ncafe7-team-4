// 메뉴 상세 — 기본 메뉴 30종 중 하나. 연금술 이름을 크게, 기본 이름을 작게. 없는 번호면 404.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserHeader from "../../_components/UserHeader";
import { basicMenuEffects, basicMenuId, basicMenuImage, basicMenus, categoryIcons, getBasicMenu } from "../_components/alchemyMenus";
import MenuOrderBox from "./_components/MenuOrderBox";
import styles from "./MenuDetail.module.css";

export function generateStaticParams() {
  return basicMenus.map((menu) => ({ id: String(basicMenuId(menu)) }));
}

export async function generateMetadata(props: PageProps<"/menu/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const menu = getBasicMenu(Number(id));
  return { title: menu ? `${menu.name} · ${menu.base}` : "메뉴" };
}

export default async function MenuDetailPage(props: PageProps<"/menu/[id]">) {
  const { id } = await props.params;
  const menuId = Number(id);
  const menu = getBasicMenu(menuId);
  if (!menu) notFound();
  const icon = categoryIcons[menu.category] ?? "🧪";
  const siblings = basicMenus.filter((other) => other.category === menu.category && other !== menu);

  return <><UserHeader /><main className={styles.page}>
    <nav className={styles.crumb} aria-label="현재 위치"><Link href="/menu">메뉴 책장</Link><span aria-hidden="true">›</span><span>{menu.category}</span><span aria-hidden="true">›</span><b>{menu.name}</b></nav>

    <section className={styles.detail}>
      <div className={styles.art}>
        <img src={basicMenuImage(menuId)} alt={`${menu.base} 그림`} />
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{menu.category} · 기본 포션</span>
        <h1>{menu.name}</h1>
        <p className={styles.base}>{menu.base}</p>
        <div className={styles.badges}><b className={styles.grade}>일반</b>{basicMenuEffects(menu).map((effect) => <b key={effect}>{effect}</b>)}</div>

        <p className={styles.story}>{menu.description}</p>

        <dl className={styles.tags}>
          <div><dt>어울리는 기분</dt><dd>{menu.emotions.map((emotion) => <span key={emotion}>{emotion}</span>)}</dd></div>
          <div><dt>맛</dt><dd>{menu.tastes.map((item) => <span key={item}>{item}</span>)}</dd></div>
        </dl>

        <MenuOrderBox menuId={menuId} name={menu.name} base={menu.base} icon={icon} price={menu.price} />
      </div>
    </section>

    {siblings.length > 0 && <section className={styles.siblings}>
      <h2>같은 {menu.category} 책장의 포션</h2>
      <div>{siblings.map((other) => { const otherId = basicMenuId(other); return <Link key={other.name} href={`/menu/${otherId}`}>
        <img src={basicMenuImage(otherId)} alt="" />
        <span><b>{other.name}</b><small>{other.base}</small></span>
        <strong>{other.price.toLocaleString()}원</strong>
      </Link>; })}</div>
    </section>}
  </main></>;
}
