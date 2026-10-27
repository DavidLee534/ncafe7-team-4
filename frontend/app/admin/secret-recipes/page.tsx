// 비밀 레시피 목록 — 밤하늘 헤더 · 개수 카드 · 등급 칩 · 이름 검색 · 표.
// 조건은 주소의 쿼리(?grade=legend&keyword=황금)로 받아 백엔드 검색 조건으로 넘긴다.
// 손님이 이미 발견한 레시피는 삭제할 수 없어서(백엔드 409) 삭제 버튼을 막고 숨김을 안내한다.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../_components/AdminPageHeader";
import DeleteButton from "../_components/DeleteButton";
import StatCard from "../_components/StatCard";
import SecretRecipeGradeBadge from "./_components/SecretRecipeGradeBadge";
import { getSecretRecipes, getSecretRecipeSummary, type SecretRecipeGrade } from "@/lib/adminApi";

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

const GRADE_CHIPS = [
  { value: "", label: "전체" },
  { value: "rare", label: "✦ 희귀" },
  { value: "legend", label: "✦✦ 전설" },
] as const;

export default async function AdminSecretRecipeListPage(props: PageProps<"/admin/secret-recipes">) {
  const searchParams = await props.searchParams;
  const grade = one(searchParams.grade);
  const keyword = one(searchParams.keyword);
  const validGrade = grade === "rare" || grade === "legend" ? (grade as SecretRecipeGrade) : undefined;

  const [summary, recipes] = await Promise.all([
    getSecretRecipeSummary(),
    getSecretRecipes({ grade: validGrade, keyword }),
  ]);
  const chipHref = (value: string) => {
    const query = new URLSearchParams();
    if (value) query.set("grade", value);
    if (keyword) query.set("keyword", keyword);
    return query.size > 0 ? `/admin/secret-recipes?${query}` : "/admin/secret-recipes";
  };

  return (
    <>
      <AdminPageHeader
        crumb="SECRET RECIPE"
        title="비밀 레시피"
        description="손님이 연금 공방에서 맞히면 도감에 열리는 비밀 레시피를 관리합니다."
        actions={
          <Link href="/admin/secret-recipes/create" className="m3-btn btn-icon:leading">
            <i className="m3-icon icon:add" aria-hidden="true"></i>
            비밀 레시피 등록
          </Link>
        }
      />

      <div className={`display:flex flex-direction:column gap:5 ${headerOverlap}`}>
        <ul className="m3-grid grid-cols:4 grid-gap:3" aria-label="비밀 레시피 개수">
          <StatCard label="전체 레시피" value={`${summary.all}개`} />
          <StatCard label="✦ 희귀" value={`${summary.rare}개`} />
          <StatCard label="✦✦ 전설" value={`${summary.legend}개`} />
          <StatCard label="손님 발견 기록" value={`${summary.discoveries}번`} />
        </ul>

        <section className="m3-card card:outlined" aria-label="비밀 레시피 표">
          <div className="display:flex flex-wrap:wrap align-items:center gap:2 padding:3">
            {GRADE_CHIPS.map((chip) => (
              <Link
                key={chip.value}
                href={chipHref(chip.value)}
                className={`m3-btn btn-size:xs ${grade === chip.value ? "" : "btn:outlined"}`}
                aria-current={grade === chip.value ? "page" : undefined}
              >
                {chip.label}
              </Link>
            ))}
            <form role="search" className="display:flex gap:2 margin-left:auto">
              {grade && <input type="hidden" name="grade" value={grade} />}
              <input
                type="search"
                name="keyword"
                defaultValue={keyword}
                placeholder="레시피 이름으로 검색"
                aria-label="레시피 이름 검색"
                style={{ padding: ".35rem .7rem", border: "1px solid var(--color-border)", borderRadius: ".6rem", background: "transparent", color: "inherit" }}
              />
              <button type="submit" className="m3-btn btn:outlined btn-size:xs">
                검색
              </button>
            </form>
          </div>

          <table className="m3-table">
            <thead>
              <tr>
                <th scope="col">레시피</th>
                <th scope="col">등급</th>
                <th scope="col">계열</th>
                <th scope="col" className="table-align:end">
                  발견한 손님
                </th>
                <th scope="col">도감 공개</th>
                <th scope="col">관리</th>
              </tr>
            </thead>
            <tbody>
              {recipes.length === 0 && (
                <tr>
                  <td colSpan={6} className="color:text-muted">
                    조건에 맞는 비밀 레시피가 없어요.
                  </td>
                </tr>
              )}
              {recipes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/secret-recipes/${r.id}`} className="display:flex align-items:center gap:2 font-weight:semibold">
                      <span
                        aria-hidden="true"
                        style={{ width: 14, height: 14, borderRadius: "50%", background: r.color, flex: "none" }}
                      />
                      {r.name}
                    </Link>
                  </td>
                  <td>
                    <SecretRecipeGradeBadge grade={r.grade} />
                  </td>
                  <td>{r.categoryName ?? "-"}</td>
                  <td className="table-align:end">{r.discoveryCount}명</td>
                  <td>
                    <span className={`m3-badge badge:inline badge-color:${r.visible ? "success" : "neutral"}`}>
                      {r.visible ? "공개" : "숨김"}
                    </span>
                  </td>
                  <td>
                    <div className="display:flex gap:1">
                      <Link href={`/admin/secret-recipes/${r.id}/edit`} className="m3-btn btn:text btn-size:xs">
                        수정
                      </Link>
                      <DeleteButton
                        path={`/api/v1/admin/secret-recipes/${r.id}`}
                        confirmMessage={`'${r.name}' 비밀 레시피를 삭제할까요?`}
                        className="m3-btn btn:text btn-color:danger btn-size:xs"
                        disabled={r.discoveryCount > 0}
                        title={r.discoveryCount > 0 ? "손님이 발견한 레시피는 삭제할 수 없어요. 수정에서 숨김으로 바꾸세요" : undefined}
                      >
                        삭제
                      </DeleteButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <p className="font-size:caption color:text-muted">
          손님이 이미 발견한 레시피는 도감 기록을 지키기 위해 삭제할 수 없습니다. 더 이상 보이지 않게 하려면 수정에서
          &lsquo;손님 도감에 공개&rsquo;를 끄세요.
        </p>
      </div>
    </>
  );
}
