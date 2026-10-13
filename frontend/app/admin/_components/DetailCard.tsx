// 상세 페이지의 카드 한 칸 — 제목과 내용. 제목은 카드의 이름표(aria-labelledby)로도 쓴다.
import type { ReactNode } from "react";

export default function DetailCard({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const titleId = `${id}-title`;
  return (
    <section className="m3-card card:outlined card-padding:self" aria-labelledby={titleId}>
      <h2 id={titleId} className="margin-bottom:4 font-size:body-lg font-weight:semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}
