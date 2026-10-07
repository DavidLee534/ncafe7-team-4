// 메뉴 목록 — 브레드크럼 · 머리 · 상태별 통계 · 필터(카테고리/상태/이름) · 표.
// 필터는 GET 폼이라 주소의 쿼리(?category=1&status=on&keyword=라떼)로 남는다. 데이터는 목업.
import Link from "next/link";
import StatCard, { type Stat } from "../../_components/StatCard";
import MockActionButton from "../../_components/MockActionButton";
import { countMenusByStatus, getCategories, getCategory, getMenus } from "@/lib/mock";
import { MENU_STATUS, won } from "@/lib/format";
import type { MenuStatus } from "@/lib/types";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminMenuListPage(props: PageProps<"/admin/menus/list">) {
  const sp = await props.searchParams;
  const category = one(sp.category);
  const status = one(sp.status);
  const keyword = one(sp.keyword);

  const menus = getMenus({
    categoryId: Number(category) || undefined,
    status: status in MENU_STATUS ? (status as MenuStatus) : undefined,
    keyword,
  });
  const categories = getCategories();
  const counts = countMenusByStatus();
  const stats: Stat[] = [
    { label: "전체 메뉴", value: String(counts.all) },
    { label: "판매 중", value: String(counts.on) },
    { label: "품절", value: String(counts.soldout) },
    { label: "비공개", value: String(counts.hidden) },
  ];

  return (
    <>
      <nav className="m3-breadcrumb breadcrumb-size:sm" aria-label="현재 위치">
        <span>메뉴 관리</span>
        <span aria-current="page">메뉴 목록</span>
      </nav>

      <div className="display:flex align-items:flex-end justify-content:space-between flex-wrap:wrap gap:4 margin-bottom:7">
        <div>
          <h1 className="font-size:heading-md font-weight:bold letter-spacing:tight">메뉴 목록</h1>
          <p className="margin-top:2 font-size:body-sm color:text-muted">등록된 메뉴를 조회하고 관리합니다.</p>
        </div>
        <Link href="/admin/menus/create" className="m3-btn btn-icon:leading">
          <i className="m3-icon icon:add" aria-hidden="true"></i>
          메뉴 등록
        </Link>
      </div>

      <ul className="m3-grid grid-cols:4 grid-gap:3 margin-bottom:6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </ul>

      <form className="m3-toolbar toolbar:fill" role="search" aria-label="메뉴 검색">
        <div className="m3-text-field field:outlined field-label:none width:ex" style={{ "--width-ex": "11rem" }}>
          <select name="category" defaultValue={category} aria-label="카테고리">
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="m3-text-field field:outlined field-label:none width:ex" style={{ "--width-ex": "9rem" }}>
          <select name="status" defaultValue={status} aria-label="판매 상태">
            <option value="">전체 상태</option>
            {Object.entries(MENU_STATUS).map(([value, s]) => (
              <option key={value} value={value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="m3-text-field field:outlined field-label:none toolbar-grow">
          <input type="search" name="keyword" defaultValue={keyword} placeholder="메뉴 이름 검색 (한글/영문)" aria-label="메뉴 이름" />
        </div>
        <button type="submit" className="m3-btn btn:outlined">
          검색
        </button>
        <Link href="/admin/menus/list" className="m3-btn btn:text">
          초기화
        </Link>
      </form>

      <section className="m3-card card:outlined" aria-label="메뉴 표">
        <table className="m3-table">
          <thead>
            <tr>
              <th scope="col">번호</th>
              <th scope="col">메뉴</th>
              <th scope="col">카테고리</th>
              <th scope="col" className="table-align:end">
                가격
              </th>
              <th scope="col">상태</th>
              <th scope="col">수정일</th>
              <th scope="col">관리</th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-align:center padding-y:8 color:text-muted">
                  조건에 맞는 메뉴가 없습니다.
                </td>
              </tr>
            ) : (
              menus.map((m) => (
                <tr key={m.id}>
                  <td className="color:text-muted">{m.id}</td>
                  <td>
                    <div className="display:flex align-items:center gap:3">
                      {m.image ? (
                        <img src={m.image} alt="" className="width:9 height:9 border-radius:2 object-fit:cover" />
                      ) : (
                        <span className="width:9 height:9 border-radius:2 background-color:surface-2" aria-hidden="true" />
                      )}
                      <div>
                        <Link href={`/admin/menus/${m.id}`} className="font-weight:semibold">
                          {m.korName}
                        </Link>
                        {m.isNew && <span className="m3-badge badge:inline badge-color:primary margin-left:2">NEW</span>}
                        <p className="font-size:caption color:text-muted">{m.engName}</p>
                      </div>
                    </div>
                  </td>
                  <td>{getCategory(m.categoryId)?.name ?? "-"}</td>
                  <td className="table-align:end">{won(m.price)}</td>
                  <td>
                    <span className={`m3-badge badge:inline badge-color:${MENU_STATUS[m.status].color}`}>
                      {MENU_STATUS[m.status].label}
                    </span>
                  </td>
                  <td className="color:text-muted">{m.updatedAt}</td>
                  <td>
                    <div className="display:flex gap:1">
                      <Link href={`/admin/menus/${m.id}/edit`} className="m3-btn btn:text btn-size:xs">
                        수정
                      </Link>
                      <MockActionButton
                        confirmMessage={`'${m.korName}' 메뉴를 삭제할까요?`}
                        className="m3-btn btn:text btn-color:danger btn-size:xs"
                      >
                        삭제
                      </MockActionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
      <p className="margin-top:3 font-size:caption color:text-muted">{menus.length}개 표시</p>
    </>
  );
}
