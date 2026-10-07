// 메뉴 상세 — 브레드크럼 · 머리(이름·상태·동작) · 기본 정보/판매 설정 표 · 대표 이미지. 없는 id면 404.
import Link from "next/link";
import { notFound } from "next/navigation";
import MockActionButton from "../../_components/MockActionButton";
import { getCategory, getMenu } from "@/lib/mock";
import { MENU_STATUS, won } from "@/lib/format";

export default async function AdminMenuDetailPage(props: PageProps<"/admin/menus/[id]">) {
  const { id } = await props.params;
  const menu = getMenu(Number(id));
  if (!menu) notFound();
  const status = MENU_STATUS[menu.status];

  return (
    <>
      <nav className="m3-breadcrumb breadcrumb-size:sm" aria-label="현재 위치">
        <span>메뉴 관리</span>
        <Link href="/admin/menus/list">메뉴 목록</Link>
        <span aria-current="page">{menu.korName}</span>
      </nav>

      <div className="display:flex align-items:flex-end justify-content:space-between flex-wrap:wrap gap:4 margin-bottom:7">
        <div>
          <div className="display:flex align-items:center gap:3">
            <h1 className="font-size:heading-md font-weight:bold letter-spacing:tight">{menu.korName}</h1>
            <span className={`m3-badge badge:inline badge-color:${status.color}`}>{status.label}</span>
          </div>
          <p className="margin-top:2 font-size:body-sm color:text-muted">
            메뉴 번호 #{menu.id} · {menu.createdAt} 등록 · {menu.updatedAt} 수정
          </p>
        </div>
        <div className="display:flex gap:2">
          <Link href="/admin/menus/list" className="m3-btn btn:outlined">
            목록으로
          </Link>
          <Link href={`/admin/menus/${menu.id}/edit`} className="m3-btn">
            수정
          </Link>
          <MockActionButton
            confirmMessage={`'${menu.korName}' 메뉴를 삭제할까요?`}
            className="m3-btn btn:outlined btn-color:danger"
          >
            삭제
          </MockActionButton>
        </div>
      </div>

      <div
        className="display:grid grid-template-columns:1 gap:5 md:grid-template-columns:ex align-items:start"
        style={{ "--grid-template-columns-ex": "minmax(0, 2fr) minmax(0, 1fr)" }}
      >
        <div className="display:flex flex-direction:column gap:5">
          <section className="m3-card card:outlined card-padding:self" aria-labelledby="basic-title">
            <h2 id="basic-title" className="margin-bottom:4 font-size:body-lg font-weight:semibold">
              기본 정보
            </h2>
            <table className="m3-table table:key-value">
              <tbody>
                <tr>
                  <th scope="row">메뉴명(한글)</th>
                  <td>{menu.korName}</td>
                  <th scope="row">메뉴명(영문)</th>
                  <td>{menu.engName}</td>
                </tr>
                <tr>
                  <th scope="row">카테고리</th>
                  <td>{getCategory(menu.categoryId)?.name ?? "-"}</td>
                  <th scope="row">가격</th>
                  <td className="font-weight:bold">{won(menu.price)}</td>
                </tr>
                <tr>
                  <th scope="row">설명</th>
                  <td colSpan={3}>{menu.description || "-"}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="m3-card card:outlined card-padding:self" aria-labelledby="sale-title">
            <h2 id="sale-title" className="margin-bottom:4 font-size:body-lg font-weight:semibold">
              판매 설정
            </h2>
            <table className="m3-table table:key-value">
              <tbody>
                <tr>
                  <th scope="row">판매 상태</th>
                  <td>
                    <span className={`m3-badge badge:inline badge-color:${status.color}`}>{status.label}</span>
                  </td>
                  <th scope="row">신메뉴 표시</th>
                  <td>{menu.isNew ? "예" : "아니오"}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <section className="m3-card card:outlined card-padding:self" aria-labelledby="image-title">
          <h2 id="image-title" className="margin-bottom:4 font-size:body-lg font-weight:semibold">
            대표 이미지
          </h2>
          {menu.image ? (
            <img src={menu.image} alt={menu.korName} className="width:full border-radius:3 object-fit:cover" />
          ) : (
            <p className="color:text-muted">등록된 이미지가 없습니다.</p>
          )}
        </section>
      </div>
    </>
  );
}
