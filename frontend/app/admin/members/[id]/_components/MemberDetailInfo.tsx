// 회원 상세 · 회원 정보 — 이메일 · 닉네임 · 역할 · 상태 · 주문 수 · 포션 수 · 가입일 · 수정일. 비밀번호는 받지도 보여주지도 않는다.
import { MEMBER_ROLE } from "@/lib/format";
import type { MemberDetail } from "@/lib/types";
import DetailCard from "../../../_components/DetailCard";
import MemberStatusBadge from "../../../_components/MemberStatusBadge";

export default function MemberDetailInfo({ member }: { member: MemberDetail }) {
  return (
    <DetailCard id="member" title="회원 정보">
      <table className="m3-table table:key-value">
        <tbody>
          <tr>
            <th scope="row">이메일</th>
            <td>{member.email}</td>
            <th scope="row">닉네임</th>
            <td>{member.nickname}</td>
          </tr>
          <tr>
            <th scope="row">역할</th>
            <td>{MEMBER_ROLE[member.role] ?? member.role}</td>
            <th scope="row">상태</th>
            <td>
              <MemberStatusBadge status={member.status} />
            </td>
          </tr>
          <tr>
            <th scope="row">주문</th>
            <td>{member.orderCount}건</td>
            <th scope="row">만든 포션</th>
            <td>{member.recipeCount}개</td>
          </tr>
          <tr>
            <th scope="row">가입일</th>
            <td>{member.createdAt}</td>
            <th scope="row">수정일</th>
            <td>{member.updatedAt}</td>
          </tr>
        </tbody>
      </table>
    </DetailCard>
  );
}
