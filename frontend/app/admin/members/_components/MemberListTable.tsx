// 회원 표 — 닉네임/이메일 · 역할 · 상태 · 가입일 · 정지/해제 · 삭제. 닉네임을 누르면 상세로 간다.
// 관리자 계정은 정지·삭제할 수 없어서 버튼을 막는다. 주문·포션이 있는 회원의 삭제는 백엔드가 막고(409) 메시지를 띄운다.
import Link from "next/link";
import DeleteButton from "../../_components/DeleteButton";
import MemberStatusAction from "../../_components/MemberStatusAction";
import MemberStatusBadge from "../../_components/MemberStatusBadge";
import { MEMBER_ROLE } from "@/lib/format";
import type { Member } from "@/lib/types";
import styles from "../../_components/AdminList.module.css";

export default function MemberListTable({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <section className="m3-card card:outlined" aria-label="회원 표">
        <div className={styles.empty}>
          <span aria-hidden="true">🐱</span>
          <h3>조건에 맞는 회원이 없어요.</h3>
          <p>상태나 검색어를 바꿔 보세요.</p>
          <Link href="/admin/members">전체 회원 보기</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`m3-card card:outlined ${styles.tableWrap}`} aria-label="회원 표">
      <table className="m3-table">
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">회원</th>
            <th scope="col">역할</th>
            <th scope="col">상태</th>
            <th scope="col">가입일</th>
            <th scope="col">관리</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isAdmin = member.role === "admin";
            return (
              <tr key={member.id}>
                <td className="color:text-muted">{member.id}</td>
                <td>
                  <Link href={`/admin/members/${member.id}`} className="color:link font-weight:semibold">
                    {member.nickname}
                  </Link>
                  <p className="font-size:caption color:text-muted">{member.email}</p>
                </td>
                <td>
                  {isAdmin ? (
                    <span className="m3-badge badge:inline badge-color:primary">{MEMBER_ROLE.admin}</span>
                  ) : (
                    MEMBER_ROLE[member.role]
                  )}
                </td>
                <td>
                  <MemberStatusBadge status={member.status} />
                </td>
                <td className="color:text-muted">{member.createdAt}</td>
                <td>
                  <div className="display:flex gap:1">
                    <MemberStatusAction member={member} className="m3-btn btn:text btn-size:xs" />
                    <DeleteButton
                      path={`/api/v1/admin/members/${member.id}`}
                      confirmMessage={`'${member.nickname}' 회원을 삭제할까요? 장바구니·발견 기록·준 별점도 함께 지워집니다.`}
                      className="m3-btn btn:text btn-color:danger btn-size:xs"
                      disabled={isAdmin}
                      title={isAdmin ? "관리자 계정은 삭제할 수 없습니다" : undefined}
                    >
                      삭제
                    </DeleteButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
