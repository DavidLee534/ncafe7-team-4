// 재료 표 — 색 · 이름(수식어) · 종류 · 계열/선반 · 효과 · 추가 금액 · 공개 여부 · 상세/삭제.
import Link from "next/link";
import type { Ingredient } from "@/lib/types";
import { INGREDIENT_TYPE, won } from "@/lib/format";
import DeleteButton from "../../_components/DeleteButton";

export default function IngredientListTable({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <section className="m3-card card:outlined" aria-label="재료 표">
      <table className="m3-table">
        <thead>
          <tr>
            <th scope="col">색</th>
            <th scope="col">재료</th>
            <th scope="col">종류</th>
            <th scope="col">계열·선반</th>
            <th scope="col">효과</th>
            <th scope="col" className="table-align:end">
              추가 금액
            </th>
            <th scope="col">공개</th>
            <th scope="col">관리</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((i) => (
            <tr key={i.id}>
              <td>
                <span
                  title={i.color}
                  aria-label={`포션 색 ${i.color}`}
                  className="border-radius:full"
                  style={{
                    display: "inline-block",
                    width: "1.5rem",
                    height: "1.5rem",
                    background: i.color,
                    border: "1px solid rgb(0 0 0 / 0.15)",
                  }}
                />
              </td>
              <td>
                <span className="font-weight:semibold">{i.name}</span>
                {i.modifier && (
                  <p className="font-size:caption color:text-muted">
                    {i.modifier}
                    {i.modifierPriority !== null && ` · ${i.modifierPriority}`}
                  </p>
                )}
              </td>
              <td>
                <span className={`m3-badge badge:inline badge-color:${INGREDIENT_TYPE[i.type].color} white-space:nowrap`}>
                  {INGREDIENT_TYPE[i.type].label}
                </span>
              </td>
              <td className="white-space:nowrap">{i.shelf}</td>
              <td className="font-size:caption">{i.effectTags.join(" · ")}</td>
              <td className="table-align:end white-space:nowrap">{i.price === 0 ? "포함" : `+${won(i.price)}`}</td>
              <td>
                <span className={`m3-badge badge:inline badge-color:${i.visible ? "success" : "neutral"}`}>
                  {i.visible ? "공개" : "숨김"}
                </span>
              </td>
              <td>
                <div className="display:flex gap:1">
                  <Link href={`/admin/ingredients/${i.id}`} className="m3-btn btn:text btn-size:xs">
                    상세
                  </Link>
                  <DeleteButton
                    path={`/api/v1/admin/ingredients/${i.id}`}
                    confirmMessage={`'${i.name}' 재료를 삭제할까요?`}
                    className="m3-btn btn:text btn-color:danger btn-size:xs"
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
  );
}
