// 비밀 레시피 등록 — 밤하늘 헤더 · SecretRecipeForm.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import SecretRecipeForm from "../_components/SecretRecipeForm";
import { getIngredients, getSecretRecipeCategories } from "@/lib/adminApi";

export default async function AdminSecretRecipeCreatePage() {
  const [categories, ingredients] = await Promise.all([getSecretRecipeCategories(), getIngredients()]);

  return (
    <>
      <AdminPageHeader
        crumb="SECRET RECIPE / NEW"
        title="비밀 레시피 등록"
        description="새 비밀 레시피를 만듭니다. 손님이 연금 공방에서 이 재료 조합을 맞히면 도감에 열려요."
        actions={
          <Link href="/admin/secret-recipes" className="m3-btn btn:outlined">
            목록으로
          </Link>
        }
      />
      <div className={headerOverlap}>
        <SecretRecipeForm mode="create" categories={categories} ingredients={ingredients} cancelHref="/admin/secret-recipes" />
      </div>
    </>
  );
}
