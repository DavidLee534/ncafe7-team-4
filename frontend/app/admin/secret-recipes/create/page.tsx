// 비밀 레시피 등록 — 밤하늘 헤더 · SecretRecipeForm.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import SecretRecipeForm from "../_components/SecretRecipeForm";
import { getSecretRecipeCategories } from "@/lib/adminApi";

export default async function AdminSecretRecipeCreatePage() {
  const categories = await getSecretRecipeCategories();

  return (
    <>
      <AdminPageHeader
        crumb="SECRET RECIPE / NEW"
        title="비밀 레시피 등록"
        description="새 비밀 레시피를 만듭니다. 재료 조합은 재료 관리가 연결되면 추가할 수 있어요."
        actions={
          <Link href="/admin/secret-recipes" className="m3-btn btn:outlined">
            목록으로
          </Link>
        }
      />
      <div className={headerOverlap}>
        <SecretRecipeForm mode="create" categories={categories} cancelHref="/admin/secret-recipes" />
      </div>
    </>
  );
}
