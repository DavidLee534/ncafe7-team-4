// 재료 목록 — 밤하늘 헤더 · 종류/계열·선반 칩 · 이름 검색 · 재료 표. 데이터는 백엔드에서 받는다.
// 필터는 주소의 쿼리(?type=extra&shelf=시럽&keyword=바닐라)로 받아 백엔드 검색 조건으로 넘긴다.
// 종류별 개수는 따로 세는 API 없이, 조건 없이 받은 전체 목록을 화면에서 센다.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../_components/AdminPageHeader";
import IngredientListTable from "./_components/IngredientListTable";
import { countIngredientsByType, getIngredients } from "@/lib/adminApi";
import { INGREDIENT_SHELVES, INGREDIENT_TYPE } from "@/lib/format";
import type { IngredientType } from "@/lib/types";

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

// 지금 조건에서 값 하나만 바꾼 목록 주소. 빈 값은 쿼리에서 뺀다
function listHref(params: { type?: string; shelf?: string; keyword?: string }) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
  return query.size > 0 ? `/admin/ingredients?${query}` : "/admin/ingredients";
}

export default async function AdminIngredientListPage(props: PageProps<"/admin/ingredients">) {
  // 1. 주소의 검색 조건
  const searchParams = await props.searchParams;
  const typeParam = one(searchParams.type);
  const type = typeParam in INGREDIENT_TYPE ? (typeParam as IngredientType) : undefined;
  const shelf = one(searchParams.shelf);
  const keyword = one(searchParams.keyword);

  // 2. 화면에 필요한 데이터
  const filtered = Boolean(type || shelf || keyword);
  const [all, ingredients] = await Promise.all([
    getIngredients(),
    filtered ? getIngredients({ type, shelf, keyword }) : undefined,
  ]);
  const counts = countIngredientsByType(all);
  const rows = ingredients ?? all;
  const shelves = type ? INGREDIENT_SHELVES[type] : [...INGREDIENT_SHELVES.base, ...INGREDIENT_SHELVES.extra];
  const typeChips: { value?: IngredientType; label: string; count: number }[] = [
    { label: "전체", count: counts.all },
    { value: "base", label: INGREDIENT_TYPE.base.label, count: counts.base },
    { value: "extra", label: INGREDIENT_TYPE.extra.label, count: counts.extra },
  ];

  // 3. 배치
  return (
    <>
      <AdminPageHeader
        crumb="INGREDIENT"
        title="재료 목록"
        description="손님이 연금솥에 넣는 재료를 관리합니다. 기반 재료는 계열별로, 추가 재료는 선반별로 나옵니다."
        actions={
          <>
            <Link href="/admin/ingredients/create" className="m3-btn btn-icon:leading">
              <i className="m3-icon icon:add" aria-hidden="true"></i>
              재료 등록
            </Link>
          </>
        }
      />

      <div className={headerOverlap}>
        <section className="m3-card card:outlined padding:4 margin-bottom:4" aria-label="재료 검색 및 필터">
          <nav className="display:flex flex-wrap:wrap gap:2" aria-label="재료 종류">
            {typeChips.map((chip) => (
              <Link
                key={chip.label}
                href={listHref({ type: chip.value, keyword })}
                className={`m3-chip ${type === chip.value ? "chip:selected" : ""}`}
                aria-current={type === chip.value ? "page" : undefined}
              >
                {chip.label} {chip.count}
              </Link>
            ))}
          </nav>

          <nav className="display:flex flex-wrap:wrap gap:2 margin-top:3" aria-label="계열·선반">
            {shelves.map((s) => (
              <Link
                key={s}
                href={listHref({ type, shelf: shelf === s ? "" : s, keyword })}
                className={`m3-chip ${shelf === s ? "chip:selected" : ""}`}
                aria-current={shelf === s ? "page" : undefined}
              >
                {s}
              </Link>
            ))}
          </nav>

          {/* GET 폼이라 조건이 주소의 쿼리로 남는다. 고른 종류·선반은 숨은 값으로 함께 보낸다 */}
          <form className="display:flex flex-wrap:wrap align-items:center gap:2 margin-top:3" role="search">
            <div className="m3-text-field field:outlined" style={{ flex: "1 1 16rem" }}>
              <input type="search" name="keyword" defaultValue={keyword} placeholder="재료명·수식어로 검색" aria-label="재료 검색" />
            </div>
            {type && <input type="hidden" name="type" value={type} />}
            {shelf && <input type="hidden" name="shelf" value={shelf} />}
            <button type="submit" className="m3-btn btn:outlined">
              검색
            </button>
            {(type || shelf || keyword) && (
              <Link href="/admin/ingredients" className="m3-btn btn:text">
                필터 초기화
              </Link>
            )}
          </form>
        </section>

        {rows.length === 0 ? (
          <section className="m3-card card:outlined padding:6 text-align:center">
            <p className="font-weight:semibold">조건에 맞는 재료가 없어요.</p>
            <p className="font-size:caption color:text-muted margin-top:1">
              검색어나 필터를 바꿔 보거나, 새 재료를 등록해 보세요.
            </p>
          </section>
        ) : (
          <IngredientListTable ingredients={rows} />
        )}
        <p className="margin-top:3 font-size:caption color:text-muted">
          {rows.length}개의 재료가 선택한 조건에 맞습니다. 숨긴 재료는 손님 화면의 재료 선반에 나오지 않습니다.
        </p>
      </div>
    </>
  );
}
