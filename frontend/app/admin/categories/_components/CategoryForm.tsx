"use client";
// 카테고리 등록·수정 공용 폼. 목업 단계라 제출하면 입력값을 확인하는 안내만 띄운다.
import type { FormEvent } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryFormProps =
  | { mode: "create"; initial?: undefined; nextSortOrder: number; cancelHref: string }
  | { mode: "edit"; initial: Category; nextSortOrder?: undefined; cancelHref: string };

function Required() {
  return <span className="color:danger">*</span>;
}

export default function CategoryForm({ mode, initial, nextSortOrder, cancelHref }: CategoryFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    window.alert(`목업 화면이라 저장되지 않습니다.\n\n${JSON.stringify(data, null, 2)}`);
  }

  return (
    <form className="m3-form max-width:ex" style={{ "--max-width-ex": "36rem" }} onSubmit={handleSubmit}>
      <section className="m3-section section:card">
        <h2 className="section-title">카테고리 정보</h2>
        <div className="form-fields">
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="name">
              카테고리명 <Required />
            </label>
            <input id="name" name="name" type="text" placeholder="예) 커피" defaultValue={initial?.name} required />
          </div>
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="engName">
              영문명 <Required />
            </label>
            <input id="engName" name="engName" type="text" placeholder="예) Coffee" defaultValue={initial?.engName} required />
          </div>
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="sortOrder">
              정렬 순서 <Required />
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={1}
              defaultValue={initial?.sortOrder ?? nextSortOrder}
              required
            />
          </div>
          <div className="form-group">
            <label className="m3-switch">
              <input type="checkbox" name="visible" defaultChecked={initial?.visible ?? true} />
              <span className="switch-label">사용자 화면에 공개</span>
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
