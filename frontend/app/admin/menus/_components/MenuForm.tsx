"use client";
// 메뉴 등록·수정 공용 폼. 제출하면 백엔드에 POST(등록) / PUT(수정)을 보내고 상세 화면으로 간다.
// 대표 이미지 · 신메뉴(NEW) · 비밀 레시피는 백엔드에 아직 칸이 없어 저장되지 않는다.
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Menu, MenuCategory } from "@/lib/types";
import { MENU_EMOTION_TAGS, MENU_STATUS, MENU_TASTE_TAGS } from "@/lib/format";
import { apiSend } from "@/lib/apiClient";

type MenuFormProps =
  | { mode: "create"; initial?: undefined; categories: MenuCategory[]; cancelHref: string }
  | { mode: "edit"; initial: Menu; categories: MenuCategory[]; cancelHref: string };

function Required() {
  return <span className="color:danger">*</span>;
}

export default function MenuForm({ mode, initial, categories, cancelHref }: MenuFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      korName: String(form.get("korName")).trim(),
      engName: String(form.get("engName")).trim(),
      price: Number(form.get("price")),
      categoryId: Number(form.get("categoryId")),
      description: String(form.get("description") ?? ""),
      status: String(form.get("status") ?? "on"),
      ownerRecommended: form.get("isRecommended") === "on",
      emotionTags: form.getAll("emotionTags").map(String),
      tasteTags: form.getAll("tasteTags").map(String),
    };

    setPending(true);
    try {
      const saved =
        mode === "create"
          ? await apiSend<{ id: number }>("POST", "/api/v1/admin/menus", body)
          : await apiSend<{ id: number }>("PUT", `/api/v1/admin/menus/${initial.id}`, body);
      router.push(`/admin/menus/${saved.id}`);
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
          <div className="display:grid grid-template-columns:1 md:grid-template-columns:2 gap:5">
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="korName">
                메뉴명(한글) <Required />
              </label>
              <input id="korName" name="korName" type="text" placeholder="예) 카페라떼" defaultValue={initial?.korName} maxLength={50} required />
            </div>
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="engName">
                메뉴명(영문) <Required />
              </label>
              <input id="engName" name="engName" type="text" placeholder="예) Caffe Latte" defaultValue={initial?.engName} maxLength={50} required />
            </div>
          </div>

          <div className="display:grid grid-template-columns:1 md:grid-template-columns:2 gap:5">
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="categoryId">
                카테고리 <Required />
              </label>
              <select id="categoryId" name="categoryId" defaultValue={initial?.categoryId ?? ""} required>
                <option value="" disabled>
                  카테고리 선택
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="price">
                가격(원) <Required />
              </label>
              <input id="price" name="price" type="number" placeholder="0" defaultValue={initial?.price} min={0} step={100} required />
            </div>
          </div>

          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="description">설명</label>
            <textarea id="description" name="description" rows={4} placeholder="사용자 화면의 메뉴 상세에 보이는 설명" defaultValue={initial?.description} maxLength={1000} />
          </div>

          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="image">대표 이미지</label>
            <input id="image" name="image" type="file" accept="image/*" />
          </div>
          {initial?.image && (
            <div className="display:flex align-items:center gap:3">
              <img src={initial.image} alt="" className="width:12 height:12 border-radius:2 object-fit:cover" />
              <span className="font-size:caption color:text-muted">현재 이미지: {initial.image}</span>
            </div>
          )}
        </div>
      </section>

      <section className="m3-section section:card">
        <h2 className="section-title">판매 설정</h2>
        <div className="form-fields">
          <fieldset className="form-group">
            <legend className="form-group-label">판매 상태</legend>
            <div className="form-group-choices">
              {Object.entries(MENU_STATUS).map(([value, s]) => (
                <label key={value} className="m3-radio">
                  <input type="radio" name="status" value={value} defaultChecked={(initial?.status ?? "on") === value} />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-group">
            <label className="m3-switch">
              <input type="checkbox" name="isNew" defaultChecked={initial?.isNew} />
              <span className="switch-label">신메뉴(NEW)로 표시</span>
            </label>
          </div>
          <div className="form-group">
            <label className="m3-switch">
              <input type="checkbox" name="isRecommended" defaultChecked={initial?.isRecommended} />
              <span className="switch-label">사장 추천 메뉴로 표시</span>
            </label>
            <p className="font-size:caption color:text-muted">메뉴 카탈로그 위쪽의 추천 메뉴 칸에 모여요.</p>
          </div>
          <div className="form-group">
            <label className="m3-switch">
              <input type="checkbox" name="isSecret" defaultChecked={initial?.isSecret} />
              <span className="switch-label">비밀 레시피로 등록</span>
            </label>
            <p className="font-size:caption color:text-muted">메뉴 카탈로그 목록에 ✦ 비밀 표시가 붙어요.</p>
          </div>
        </div>
      </section>

      <section className="m3-section section:card">
        <h2 className="section-title">감정 연금술 추천</h2>
        <div className="form-fields">
          <fieldset className="form-group">
            <legend className="form-group-label">어울리는 감정 (3개까지)</legend>
            <div className="form-group-choices">
              {MENU_EMOTION_TAGS.map((tag) => (
                <label key={tag} className="m3-checkbox">
                  <input type="checkbox" name="emotionTags" value={tag} defaultChecked={initial?.emotionTags?.includes(tag)} />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="form-group">
            <legend className="form-group-label">맛 (3개까지)</legend>
            <div className="form-group-choices">
              {MENU_TASTE_TAGS.map((tag) => (
                <label key={tag} className="m3-checkbox">
                  <input type="checkbox" name="tasteTags" value={tag} defaultChecked={initial?.tasteTags?.includes(tag)} />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="font-size:caption color:text-muted">손님이 감정 연금술에서 고른 기분·맛과 겹칠수록 이 메뉴를 먼저 추천해요.</p>
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
