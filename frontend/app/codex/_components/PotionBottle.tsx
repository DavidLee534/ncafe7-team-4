// 도감 카드와 상세에 쓰는 물약 병. 잠긴 항목은 검은 실루엣에 물음표.
export default function PotionBottle({ color, locked, className }: { color: string; locked: boolean; className?: string }) {
  const dark = "#3b3248";
  return (
    <svg className={className} viewBox="0 0 80 96" aria-hidden="true">
      <rect x="31" y="6" width="18" height="8" rx="2" fill={locked ? dark : "#b5875a"} />
      <path
        d="M33 14 h14 v14 q20 8 20 32 q0 30 -27 30 q-27 0 -27 -30 q0 -24 20 -32z"
        fill={locked ? dark : "#ffffff"}
        stroke={locked ? dark : "#dbc9bd"}
        strokeWidth="2"
      />
      {locked ? (
        <text x="40" y="66" textAnchor="middle" fontSize="18" fontWeight="700" fill="#efe4da">?</text>
      ) : (
        <>
          <path d="M15 60 q0 26 25 26 q25 0 25 -26 q-12 6 -25 0 q-13 -6 -25 0z" fill={color} />
          <circle cx="30" cy="70" r="3" fill="#ffffff" opacity=".6" />
          <circle cx="46" cy="64" r="2" fill="#ffffff" opacity=".6" />
        </>
      )}
    </svg>
  );
}
