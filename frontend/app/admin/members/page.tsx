// 회원 목록 — 밤하늘 헤더 · 현황 숫자 · 상태 칩/검색 · 회원 표. 데이터는 백엔드에서 받는다.
// 필터는 주소의 쿼리(?status=suspended&keyword=moka&role=member)로 받아 백엔드 검색 조건으로 넘긴다.
//   현황 숫자 · 상태 칩의 개수 → summary, 표 → 목록 API + 조건
import AdminPageHeader, { headerOverlap } from "../_components/AdminPageHeader";
import StatCard, { type Stat } from "../_components/StatCard";
import MemberListFilters from "./_components/MemberListFilters";
import MemberListTable from "./_components/MemberListTable";
import { getMembers, getMemberSummary } from "@/lib/adminApi";
import { MEMBER_ROLE, MEMBER_STATUS } from "@/lib/format";
import type { MemberRole, MemberStatus } from "@/lib/types";

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AdminMemberListPage(props: PageProps<"/admin/members">) {
  // 1. 주소의 검색 조건
  const searchParams = await props.searchParams;
  const status = one(searchParams.status);
  const keyword = one(searchParams.keyword);
  const role = one(searchParams.role);

  // 2. 화면에 필요한 데이터
  const [summary, members] = await Promise.all([
    getMemberSummary(),
    getMembers({
      status: status in MEMBER_STATUS ? (status as MemberStatus) : undefined,
      role: role in MEMBER_ROLE ? (role as MemberRole) : undefined,
      keyword,
    }),
  ]);
  const stats: Stat[] = [
    { label: "전체 회원", value: `${summary.all}명` },
    { label: "정상", value: `${summary.active}명` },
    { label: "정지", value: `${summary.suspended}명` },
  ];

  // 3. 배치
  return (
    <>
      <AdminPageHeader
        crumb="MEMBERS"
        title="회원 관리"
        description="가입한 회원을 보고 정지하거나 삭제합니다. 주문·포션이 있는 회원은 삭제 대신 정지하세요."
      />

      <ul className={`m3-grid grid-cols:3 grid-gap:3 ${headerOverlap}`}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </ul>

      <MemberListFilters summary={summary} status={status} keyword={keyword} role={role} memberCount={members.length} />
      <MemberListTable members={members} />
    </>
  );
}
