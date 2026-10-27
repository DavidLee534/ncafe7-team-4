// 손님 카탈로그 화면의 메뉴 카드 — 관리자 메뉴 카드(MenuListCard)와 같은 모양. 그림 · 코드 · 상태 · 계열 · 이름 · 가격.
// 카드 아래 줄(담기 · 고르기 버튼 등)은 children 으로 받는다. selected 면 테두리를 강조한다.
// href 를 주면 그림과 이름이 그 주소(메뉴 상세)로 가는 링크가 된다.
// showArt={false} 면 그림 칸을 빼고, 코드 · 상태는 본문 맨 위 줄에 둔다 (예: 기본 메뉴 고르기).
import type { ReactNode } from "react";
import Link from "next/link";
import { pawCode } from "@/lib/cat";
import { won } from "@/lib/format";
import styles from "./Catalog.module.css";

type Props = {
  id: number;
  name: string;
  engName?: string;
  categoryName: string | null;
  price: number;
  imageUrl: string | null;
  badge?: { label: string; color: "success" | "warning" | "neutral" | "primary" };
  tags?: string[];
  selected?: boolean;
  href?: string;
  showArt?: boolean;
  children?: ReactNode;
};

export default function CatalogCard({ id, name, engName, categoryName, price, imageUrl, badge, tags = [], selected = false, href, showArt = true, children }: Props) {
  const badgeClass = badge && `m3-badge badge:inline badge-color:${badge.color}`;
  const art = (
    <>
      {/* 메뉴 그림은 크기 없는 SVG라 CSS가 늦게 들어와도 커지지 않게 크기를 직접 준다 */}
      {imageUrl ? <img src={imageUrl} alt="" width={116} height={116} /> : <span aria-hidden="true">☕</span>}
      <span className={styles.code}>{pawCode(id)}</span>
      {badge && <span className={`${badgeClass} ${styles.status}`}>{badge.label}</span>}
    </>
  );

  return (
    <li className={`${styles.card} ${selected ? styles.cardSelected : ""}`}>
      {showArt &&
        (href ? (
          <Link href={href} className={styles.art} aria-label={`${name} 상세`}>
            {art}
          </Link>
        ) : (
          <div className={styles.art}>{art}</div>
        ))}
      <div className={styles.body}>
        {!showArt && (
          <div className={styles.bodyHead}>
            <span className={styles.codeInline}>{pawCode(id)}</span>
            {badge && <span className={badgeClass}>{badge.label}</span>}
          </div>
        )}
        <p className={styles.category}>{categoryName ?? "-"}</p>
        {showArt ? (
          <p className={styles.name}>{href ? <Link href={href}>{name}</Link> : name}</p>
        ) : (
          // 그림 없는 카드는 가격을 이름 오른쪽에 작게 둔다
          <p className={`${styles.name} ${styles.nameRow}`}>
            <span>{href ? <Link href={href}>{name}</Link> : name}</span>
            <span className={styles.priceInline}>{won(price)}</span>
          </p>
        )}
        {engName !== undefined && <p className={styles.eng}>{engName}</p>}
        {showArt && <p className={styles.price}>{won(price)}</p>}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <b key={tag}>{tag}</b>
            ))}
          </div>
        )}
        {children && <div className={styles.foot}>{children}</div>}
      </div>
    </li>
  );
}
