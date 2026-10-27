// 재료 등록 — 밤하늘 헤더 · IngredientForm.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import IngredientForm from "../_components/IngredientForm";

export default function AdminIngredientCreatePage() {
  return (
    <>
      <AdminPageHeader
        crumb="INGREDIENT / NEW"
        title="재료 등록"
        description="재료 선반에 새 재료를 올립니다."
        actions={
          <>
            <Link href="/admin/ingredients" className="m3-btn btn:outlined">
              목록으로
            </Link>
          </>
        }
      />

      <div className={headerOverlap}>
        <IngredientForm mode="create" cancelHref="/admin/ingredients" />
      </div>
    </>
  );
}
