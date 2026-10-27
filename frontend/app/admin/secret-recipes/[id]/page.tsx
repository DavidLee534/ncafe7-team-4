// 비밀 레시피 상세 — 밤하늘 헤더(이름·등급·동작) · 레시피 정보 · 도감 문구 · 발견한 손님. 없는 id면 404.
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import DeleteButton from "../../_components/DeleteButton";
import DetailCard from "../../_components/DetailCard";
import SecretRecipeGradeBadge from "../_components/SecretRecipeGradeBadge";
import { getSecretRecipe, getSecretRecipeDiscoveries } from "@/lib/adminApi";

export default async function AdminSecretRecipeDetailPage(props: PageProps<"/admin/secret-recipes/[id]">) {
  const { id } = await props.params;
  const recipe = await getSecretRecipe(Number(id));
  if (!recipe) notFound();
  const discoveries = await getSecretRecipeDiscoveries(recipe.id);

  return (
    <>
      <AdminPageHeader
        crumb={`SECRET RECIPE / #${recipe.id}`}
        title={
          <>
            {recipe.name} <SecretRecipeGradeBadge grade={recipe.grade} />
          </>
        }
        description={`${recipe.createdAt} 등록 · ${recipe.updatedAt} 수정 · ${recipe.visible ? "손님 도감에 공개 중" : "손님 도감에서 숨김"}`}
        actions={
          <>
            <Link href="/admin/secret-recipes" className="m3-btn btn:outlined">
              목록으로
            </Link>
            <Link href={`/admin/secret-recipes/${recipe.id}/edit`} className="m3-btn">
              수정
            </Link>
            <DeleteButton
              path={`/api/v1/admin/secret-recipes/${recipe.id}`}
              confirmMessage={`'${recipe.name}' 비밀 레시피를 삭제할까요?`}
              redirectHref="/admin/secret-recipes"
              className="m3-btn btn:outlined btn-color:danger"
              disabled={recipe.discoveryCount > 0}
              title={recipe.discoveryCount > 0 ? "손님이 발견한 레시피는 삭제할 수 없어요. 수정에서 숨김으로 바꾸세요" : undefined}
            >
              삭제
            </DeleteButton>
          </>
        }
      />

      <div
        className={`display:grid grid-template-columns:1 gap:5 md:grid-template-columns:ex align-items:start ${headerOverlap}`}
        style={{ "--grid-template-columns-ex": "minmax(0, 2fr) minmax(0, 1fr)" }}
      >
        <div className="display:flex flex-direction:column gap:5">
          <DetailCard id="recipe-info" title="레시피 정보">
            <dl className="display:grid gap:3" style={{ gridTemplateColumns: "8rem 1fr" }}>
              <dt className="color:text-muted">계열</dt>
              <dd>{recipe.categoryName ?? "-"}</dd>
              <dt className="color:text-muted">포션 색</dt>
              <dd className="display:flex align-items:center gap:2">
                <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: "50%", background: recipe.color }} />
                <code>{recipe.color}</code>
              </dd>
              <dt className="color:text-muted">재료 조합</dt>
              <dd className="color:text-muted">재료 관리가 연결되면 여기에 표시돼요.</dd>
            </dl>
          </DetailCard>
          <DetailCard id="recipe-text" title="도감 문구">
            <p className="font-size:caption color:text-muted">모카 점장의 수수께끼 · 발견 전에 보임</p>
            <p className="margin-top:1">{recipe.riddle ? `“${recipe.riddle}”` : "-"}</p>
            <p className="margin-top:4 font-size:caption color:text-muted">설명 · 발견한 뒤 보임</p>
            <p className="margin-top:1">{recipe.description ?? "-"}</p>
          </DetailCard>
        </div>

        <DetailCard id="recipe-discoveries" title={`발견한 손님 ${discoveries.length}명`}>
          {discoveries.length === 0 ? (
            <p className="color:text-muted">아직 이 레시피를 찾은 손님이 없어요.</p>
          ) : (
            <ul className="display:flex flex-direction:column gap:2">
              {discoveries.map((d) => (
                <li key={d.memberId} className="display:flex justify-content:space-between gap:2">
                  <span>🐾 {d.nickname}</span>
                  <span className="color:text-muted">{d.discoveredAt}</span>
                </li>
              ))}
            </ul>
          )}
        </DetailCard>
      </div>
    </>
  );
}
