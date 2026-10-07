// 통계 카드 — "레이블 / 큰 숫자" 카드. m3-grid 안 li 로 놓는다.
export type Stat = { label: string; value: string };

export default function StatCard({ label, value }: Stat) {
  return (
    <li className="m3-card card:outlined card-padding:self">
      <span className="display:block font-size:body-sm color:text-muted">{label}</span>
      <strong className="display:block margin-top:2 font-size:heading-md font-weight:bold letter-spacing:tight">
        {value}
      </strong>
    </li>
  );
}
