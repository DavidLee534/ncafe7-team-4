// 회원 상세 — 밤하늘 헤더(닉네임·상태·정지/삭제) · 회원 정보 · 활동. 없는 id면 404.
// 페이지는 데이터를 준비해서 배치만 하고, 각 칸은 받은 값을 보여주기만 한다.
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import DeleteButton from "../../_components/DeleteButton";
import MemberStatusAction from "../../_components/MemberStatusAction";
import MemberStatusBadge from "../../_components/MemberStatusBadge";
import MemberDetailInfo from "./_components/MemberDetailInfo";
import { getMember } from "@/lib/adminApi";

export default async function AdminMemberDetailPage(props: PageProps<"/admin/members/[id]">) {
  const { id } = await props.params;
  const member = await getMember(Number(id));
  if (!member) notFound();
  const isAdmin = member.role === "admin";
  const hasRecords = member.orderCount > 0 || member.recipeCount > 0;

  return (
    <>
      <AdminPageHeader
        crumb={`MEMBERS / #${member.id}`}
        title={
          <>
            {member.nickname} <MemberStatusBadge status={member.status} className="vertical-align:middle" />
          </>
        }
        description={`회원 번호 #${member.id} · ${member.email} · ${member.createdAt} 가입`}
        actions={
          <>
            <Link href="/admin/members" className="m3-btn btn:outlined">
              목록으로
            </Link>
            <MemberStatusAction member={member} className="m3-btn" />
            <DeleteButton
              path={`/api/v1/admin/members/${member.id}`}
              confirmMessage={`'${member.nickname}' 회원을 삭제할까요? 장바구니·발견 기록·준 별점도 함께 지워집니다.`}
              redirectHref="/admin/members"
              className="m3-btn btn:outlined btn-color:danger"
              disabled={isAdmin || hasRecords}
              title={
                isAdmin
                  ? "관리자 계정은 삭제할 수 없습니다"
                  : hasRecords
                    ? "주문·포션이 있는 회원은 삭제할 수 없습니다. 정지하세요"
                    : undefined
              }
            >
              삭제
            </DeleteButton>
          </>
        }
      />

      <div className={headerOverlap}>
        <MemberDetailInfo member={member} />
      </div>
    </>
  );
}
