// 재료 상세 — 밤하늘 헤더 · IngredientForm(기존 값). 이 화면에서 바로 수정(PUT)·삭제(DELETE)한다. 없는 id면 404.
import Link from "next/link";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import { notFound } from "next/navigation";
import IngredientForm from "../_components/IngredientForm";
import DeleteButton from "../../_components/DeleteButton";
import { getIngredient } from "@/lib/adminApi";
import { INGREDIENT_TYPE } from "@/lib/format";

export default async function AdminIngredientDetailPage(props: PageProps<"/admin/ingredients/[id]">) {
  const { id } = await props.params;
  const ingredient = await getIngredient(Number(id));
  if (!ingredient) notFound();

  return (
    <>
      <AdminPageHeader
        crumb="INGREDIENT / DETAIL"
        title="재료 상세"
        description={
          <>
            재료 번호 #{ingredient.id} · {INGREDIENT_TYPE[ingredient.type].label} · {ingredient.shelf} · 등록일{" "}
            {ingredient.createdAt}
          </>
        }
        actions={
          <>
            <Link href="/admin/ingredients" className="m3-btn btn:outlined">
              목록으로
            </Link>
            <DeleteButton
              path={`/api/v1/admin/ingredients/${ingredient.id}`}
              confirmMessage={`'${ingredient.name}' 재료를 삭제할까요?`}
              redirectHref="/admin/ingredients"
              className="m3-btn btn:outlined btn-color:danger"
            >
              삭제
            </DeleteButton>
          </>
        }
      />

      <div className={headerOverlap}>
        <IngredientForm mode="edit" initial={ingredient} cancelHref="/admin/ingredients" />
      </div>
    </>
  );
}
