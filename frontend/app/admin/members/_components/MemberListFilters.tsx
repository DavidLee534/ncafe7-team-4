// 회원 목록 조작 패널 — 제목 · 상태 칩 · 검색 폼(이메일·닉네임, 역할).
// 상태 칩은 ?status= 로 이동하고, 검색 폼은 GET 이라 조건이 주소의 쿼리로 남는다.
// 고른 상태는 숨은 값으로 함께 보내서 검색해도 유지되고, 칩을 눌러도 검색어·역할은 유지된다.
import Link from "next/link";
import { MEMBER_ROLE, MEMBER_STATUS } from "@/lib/format";
import type { MemberStatus, MemberSummary } from "@/lib/types";
import styles from "../../_components/AdminList.module.css";

type Props = {
  summary: MemberSummary;
  status: string;
  keyword: string;
  role: string;
  memberCount: number; // 조건에 맞는 회원 수
};

export default function MemberListFilters({ summary, status, keyword, role, memberCount }: Props) {
  const href = (nextStatus: string) => {
    const query = new URLSearchParams();
    if (nextStatus) query.set("status", nextStatus);
    if (keyword) query.set("keyword", keyword);
    if (role) query.set("role", role);
    return query.size > 0 ? `/admin/members?${query}` : "/admin/members";
  };
  const chipClass = (active: boolean) => `${styles.chip} ${active ? styles.chipActive : ""}`;

  return (
    <section className={styles.panel} aria-labelledby="member-list-title">
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>BAKERY REGULARS</span>
          <h2 id="member-list-title">회원 목록</h2>
        </div>
        <p>
          <strong>{memberCount}</strong>명의 회원이 선택한 조건에 맞습니다.
        </p>
      </div>

      <nav className={styles.rail} aria-label="회원 상태 빠른 필터">
        <Link href={href("")} className={chipClass(!status)}>
          전체 <span>{summary.all}</span>
        </Link>
        {(Object.keys(MEMBER_STATUS) as MemberStatus[]).map((value) => (
          <Link key={value} href={href(value)} className={chipClass(status === value)}>
            {MEMBER_STATUS[value].label} <span>{summary[value]}</span>
          </Link>
        ))}
      </nav>

      <form className={styles.filterBar} role="search" aria-label="회원 검색">
        <label className={styles.searchField}>
          <i className="m3-icon icon:search" aria-hidden="true" />
          <input type="search" name="keyword" defaultValue={keyword} placeholder="이메일 또는 닉네임으로 검색" />
        </label>
        <label className={styles.selectField}>
          <span className="sr-only">역할</span>
          <select name="role" defaultValue={role} aria-label="역할">
            <option value="">전체 역할</option>
            {Object.entries(MEMBER_ROLE).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {status && <input type="hidden" name="status" value={status} />}
        <button type="submit" className="m3-btn btn:outlined">
          적용
        </button>
        {(status || keyword || role) && (
          <Link href="/admin/members" className={styles.resetLink}>
            필터 초기화
          </Link>
        )}
      </form>
    </section>
  );
}
