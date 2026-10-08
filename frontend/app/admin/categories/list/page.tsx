// 카테고리 목록 — 밤하늘 헤더 · 표(정렬 순서·이름·메뉴 수·공개 여부). 데이터는 목업.
// 메뉴가 남아 있는 카테고리는 삭제할 수 없게 버튼을 막는다.
import Link from "next/link";
import NightHero, { heroOverlap } from "../../_components/NightHero";
import MockActionButton from "../../_components/MockActionButton";
import { countMenusByCategory, getCategories } from "@/lib/mock";

export default function AdminCategoryListPage() {
  const categories = getCategories();

  return (
    <>
      <NightHero
        crumb="CATEGORY"
        title="카테고리 목록"
        description="메뉴를 묶는 카테고리를 관리합니다. 정렬 순서대로 사용자 화면의 탭에 나옵니다."
        actions={
          <>
            <Link href="/admin/categories/create" className="m3-btn btn-icon:leading">
              <i className="m3-icon icon:add" aria-hidden="true"></i>
              카테고리 등록
            </Link>
          </>
        }
      />

      <div className={heroOverlap}>
        <section className="m3-card card:outlined" aria-label="카테고리 표">
          <table className="m3-table">
            <thead>
              <tr>
                <th scope="col">순서</th>
                <th scope="col">카테고리</th>
                <th scope="col" className="table-align:end">
                  메뉴 수
                </th>
                <th scope="col">공개</th>
                <th scope="col">등록일</th>
                <th scope="col">관리</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const menuCount = countMenusByCategory(c.id);
                return (
                  <tr key={c.id}>
                    <td className="color:text-muted">{c.sortOrder}</td>
                    <td>
                      <span className="font-weight:semibold">{c.name}</span>
                      <p className="font-size:caption color:text-muted">{c.engName}</p>
                    </td>
                    <td className="table-align:end">
                      <Link href={`/admin/menus/list?category=${c.id}`} className="color:link">
                        {menuCount}개
                      </Link>
                    </td>
                    <td>
                      <span className={`m3-badge badge:inline badge-color:${c.visible ? "success" : "neutral"}`}>
                        {c.visible ? "공개" : "숨김"}
                      </span>
                    </td>
                    <td className="color:text-muted">{c.createdAt}</td>
                    <td>
                      <div className="display:flex gap:1">
                        <Link href={`/admin/categories/${c.id}/edit`} className="m3-btn btn:text btn-size:xs">
                          수정
                        </Link>
                        <MockActionButton
                          confirmMessage={`'${c.name}' 카테고리를 삭제할까요?`}
                          className="m3-btn btn:text btn-color:danger btn-size:xs"
                          disabled={menuCount > 0}
                          title={menuCount > 0 ? "메뉴가 있는 카테고리는 삭제할 수 없습니다" : undefined}
                        >
                          삭제
                        </MockActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <p className="margin-top:3 font-size:caption color:text-muted">
          메뉴가 있는 카테고리는 삭제할 수 없습니다. 먼저 메뉴를 다른 카테고리로 옮기세요.
        </p>
      </div>
    </>
  );
}
