"use client";
// 메뉴 등록·수정 공용 폼. 목업 단계라 제출하면 입력값을 확인하는 안내만 띄운다.
import type { FormEvent } from "react";
import Link from "next/link";
import type { Category, Menu } from "@/lib/types";
import { MENU_STATUS } from "@/lib/format";

type MenuFormProps =
  | { mode: "create"; initial?: undefined; categories: Category[]; cancelHref: string }
  | { mode: "edit"; initial: Menu; categories: Category[]; cancelHref: string };

function Required() {
  return <span className="color:danger">*</span>;
}

export default function MenuForm({ mode, initial, categories, cancelHref }: MenuFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    window.alert(`목업 화면이라 저장되지 않습니다.\n\n${JSON.stringify(data, null, 2)}`);
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
              <input id="korName" name="korName" type="text" placeholder="예) 카페라떼" defaultValue={initial?.korName} required />
            </div>
            <div className="m3-text-field field:outlined field-label:top">
              <label htmlFor="engName">
                메뉴명(영문) <Required />
              </label>
              <input id="engName" name="engName" type="text" placeholder="예) Caffe Latte" defaultValue={initial?.engName} required />
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
            <textarea id="description" name="description" rows={4} placeholder="사용자 화면의 메뉴 상세에 보이는 설명" defaultValue={initial?.description} />
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
        </div>
      </section>

      <div className="form-actions form-actions:end">
        <Link href={cancelHref} className="m3-btn btn:outlined">
          취소
        </Link>
        <button type="submit" className="m3-btn">
          {mode === "create" ? "등록하기" : "저장하기"}
        </button>
      </div>
    </form>
  );
}
