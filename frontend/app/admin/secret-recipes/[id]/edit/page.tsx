// 비밀 레시피 수정 — 밤하늘 헤더 · SecretRecipeForm(기존 값). 없는 id면 404.
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminPageHeader, { headerOverlap } from "../../../_components/AdminPageHeader";
import SecretRecipeForm from "../../_components/SecretRecipeForm";
import { getSecretRecipe, getSecretRecipeCategories } from "@/lib/adminApi";

export default async function AdminSecretRecipeEditPage(props: PageProps<"/admin/secret-recipes/[id]/edit">) {
  const { id } = await props.params;
  const [recipe, categories] = await Promise.all([getSecretRecipe(Number(id)), getSecretRecipeCategories()]);
  if (!recipe) notFound();

  return (
    <>
      <AdminPageHeader
        crumb="SECRET RECIPE / EDIT"
        title="비밀 레시피 수정"
        description={<>레시피 번호 #{recipe.id} · 발견한 손님 {recipe.discoveryCount}명</>}
        actions={
          <Link href={`/admin/secret-recipes/${recipe.id}`} className="m3-btn btn:outlined">
            상세로
          </Link>
        }
      />
      <div className={headerOverlap}>
        <SecretRecipeForm mode="edit" initial={recipe} categories={categories} cancelHref={`/admin/secret-recipes/${recipe.id}`} />
      </div>
    </>
  );
}
