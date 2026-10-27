"use client";
// 재료 등록·수정 공용 폼. 제출하면 백엔드에 POST(등록) / PUT(수정)을 보내고 목록으로 간다.
// 종류(기반·추가)를 바꾸면 고를 수 있는 계열·선반이 바뀌고, 수식어 칸은 추가 재료일 때만 보인다.
// 이름이 겹치면 백엔드가 409 로 거절하고, 그 메시지를 알림으로 띄운다.
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Ingredient, IngredientType } from "@/lib/types";
import { EFFECT_TAGS, INGREDIENT_SHELVES, INGREDIENT_TYPE } from "@/lib/format";
import { apiSend } from "@/lib/apiClient";

type IngredientFormProps =
  | { mode: "create"; initial?: undefined; cancelHref: string }
  | { mode: "edit"; initial: Ingredient; cancelHref: string };

function Required() {
  return <span className="color:danger">*</span>;
}

export default function IngredientForm({ mode, initial, cancelHref }: IngredientFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [type, setType] = useState<IngredientType>(initial?.type ?? "extra");
  const [color, setColor] = useState(initial?.color ?? "#C8873A");
  // 종류를 바꾸면 계열·선반 목록이 바뀌므로, 고른 값이 새 목록에 없으면 첫 항목으로
  const shelves = INGREDIENT_SHELVES[type];
  const [shelf, setShelf] = useState(initial?.shelf ?? shelves[0]);
  const shelfValue = shelves.includes(shelf) ? shelf : shelves[0];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const effectTags = form.getAll("effectTags").map(String);
    if (effectTags.length === 0) {
      window.alert("효과 태그를 하나 이상 고르세요.");
      return;
    }
    const priority = String(form.get("modifierPriority") ?? "");
    const body = {
      name: String(form.get("name")).trim(),
      type,
      shelf: shelfValue,
      price: Number(form.get("price")),
      color,
      effectTags,
      modifier: type === "extra" ? String(form.get("modifier") ?? "").trim() : null,
      modifierPriority: type === "extra" && priority !== "" ? Number(priority) : null,
      visible: form.get("visible") === "on",
    };

    setPending(true);
    try {
      if (mode === "create") await apiSend("POST", "/api/v1/admin/ingredients", body);
      else await apiSend("PUT", `/api/v1/admin/ingredients/${initial.id}`, body);
      router.push("/admin/ingredients");
      router.refresh();
    } catch (error) {
      window.alert((error as Error).message);
      setPending(false);
    }
  }

  return (
    <form className="m3-form max-width:ex" style={{ "--max-width-ex": "48rem" }} onSubmit={handleSubmit}>
      <section className="m3-section section:card">
        <h2 className="section-title">기본 정보</h2>
        <div className="form-fields">
          <fieldset className="form-group">
            <legend className="form-group-label">
              재료 종류 <Required />
            </legend>
            <div className="form-group-choices">
              {Object.entries(INGREDIENT_TYPE).map(([value, t]) => (
                <label key={value} className="m3-radio">
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={type === value}
                    onChange={() => setType(value as IngredientType)}
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
            <p className="font-size:caption color:text-muted">
              기반 재료는 계열마다 손님이 꼭 하나 고르는 재료, 추가 재료는 선반에서 골라 넣는 재료예요.
            </p>
          </fieldset>

          <div className="display:grid grid-template-columns:1 md:grid-template-columns:2 gap:5">
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="name">
                재료명 <Required />
              </label>
              <input id="name" name="name" type="text" placeholder="예) 바닐라" defaultValue={initial?.name} maxLength={30} required />
            </div>
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="shelf">
                {type === "base" ? "계열" : "선반"} <Required />
              </label>
              <select id="shelf" name="shelf" value={shelfValue} onChange={(e) => setShelf(e.target.value)} required>
                {shelves.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="display:grid grid-template-columns:1 md:grid-template-columns:2 gap:5">
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="price">
                추가 금액(원) <Required />
              </label>
              <input
                id="price"
                name="price"
                type="number"
                placeholder="0"
                defaultValue={initial?.price ?? 0}
                min={0}
                step={100}
                required
              />
            </div>
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="color">
                포션 색 <Required />
              </label>
              <div className="display:flex align-items:center gap:3">
                <input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value.toUpperCase())}
                  aria-label="포션 색 고르기"
                  style={{ width: "3rem", height: "2.5rem", padding: 0, flex: "none" }}
                />
                <span className="font-family:mono">{color}</span>
              </div>
            </div>
          </div>
          <p className="font-size:caption color:text-muted">
            가격 단계: 기본 포함 0원 · 기본 +500원 · 특별 +800원 · 고급 +1,500원. 기반 재료는 보통 0원이에요.
          </p>

          <fieldset className="form-group">
            <legend className="form-group-label">
              효과 태그 <Required />
            </legend>
            <div className="form-group-choices">
              {EFFECT_TAGS.map((tag) => (
                <label key={tag} className="m3-checkbox">
                  <input type="checkbox" name="effectTags" value={tag} defaultChecked={initial?.effectTags.includes(tag)} />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
            <p className="font-size:caption color:text-muted">1~3개. 포션의 효과 칭호와 문구를 정하는 데 쓰여요.</p>
          </fieldset>
        </div>
      </section>

      {type === "extra" && (
        <section className="m3-section section:card">
          <h2 className="section-title">이름 수식어</h2>
          <div className="form-fields">
            <div className="display:grid grid-template-columns:1 md:grid-template-columns:2 gap:5">
              <div className="m3-text-field field:outlined field-label:top">
                <label htmlFor="modifier">수식어</label>
                <input
                  id="modifier"
                  name="modifier"
                  type="text"
                  placeholder="예) 빛을 머금은"
                  defaultValue={initial?.modifier}
                  maxLength={30}
                />
              </div>
              <div className="m3-text-field field:outlined field-label:top">
                <label htmlFor="modifierPriority">우선순위</label>
                <input
                  id="modifierPriority"
                  name="modifierPriority"
                  type="number"
                  placeholder="예) 30"
                  defaultValue={initial?.modifierPriority ?? undefined}
                  min={0}
                  step={10}
                />
              </div>
            </div>
            <p className="font-size:caption color:text-muted">
              포션 이름 앞에 붙어요. 우선순위가 클수록 앞에 와요 (30 맛을 크게 바꾸는 재료 · 20 질감·바탕 · 10 마무리 장식).
            </p>
          </div>
        </section>
      )}

      <section className="m3-section section:card">
        <h2 className="section-title">노출 설정</h2>
        <div className="form-fields">
          <div className="form-group">
            <label className="m3-switch">
              <input type="checkbox" name="visible" defaultChecked={initial?.visible ?? true} />
              <span className="switch-label">손님 화면의 재료 선반에 공개</span>
            </label>
            <p className="font-size:caption color:text-muted">재고가 없을 때 끄면 선반에서 잠시 숨겨요.</p>
          </div>
        </div>
      </section>

      <div className="form-actions form-actions:end">
        <Link href={cancelHref} className="m3-btn btn:outlined">
          취소
        </Link>
        <button type="submit" className="m3-btn" disabled={pending}>
          {pending ? "저장 중…" : mode === "create" ? "등록하기" : "저장하기"}
        </button>
      </div>
    </form>
  );
}
