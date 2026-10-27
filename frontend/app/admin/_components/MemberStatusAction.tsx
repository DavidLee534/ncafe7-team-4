// 회원 상태 버튼 — 정상이면 "정지", 정지면 "정지 해제". 관리자 계정은 바꿀 수 없어서 막아 둔다.
// 목록의 줄과 상세 헤더에서 함께 쓴다.
import type { Member } from "@/lib/types";
import StatusChangeButton from "./StatusChangeButton";

type Props = {
  member: Pick<Member, "id" | "nickname" | "role" | "status">;
  className: string;
};

export default function MemberStatusAction({ member, className }: Props) {
  const suspended = member.status === "suspended";
  const isAdmin = member.role === "admin";

  return (
    <StatusChangeButton
      path={`/api/v1/admin/members/${member.id}/status`}
      status={suspended ? "active" : "suspended"}
      confirmMessage={
        suspended ? `'${member.nickname}' 회원의 정지를 해제할까요?` : `'${member.nickname}' 회원을 정지할까요?`
      }
      className={className}
      disabled={isAdmin}
      title={isAdmin ? "관리자 계정은 정지할 수 없습니다" : undefined}
    >
      {suspended ? "정지 해제" : "정지"}
    </StatusChangeButton>
  );
}
