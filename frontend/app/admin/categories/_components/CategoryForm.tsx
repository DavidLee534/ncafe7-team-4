"use client";
// 카테고리 등록·수정 공용 폼. 제출하면 백엔드에 POST(등록) / PUT(수정)을 보내고 목록으로 간다.
// 이름이 겹치면 백엔드가 409 로 거절하고, 그 메시지를 알림으로 띄운다.
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { apiSend } from "@/lib/apiClient";

type CategoryFormProps =
  | { mode: "create"; initial?: undefined; nextSortOrder: number; cancelHref: string }
  | { mode: "edit"; initial: Category; nextSortOrder?: undefined; cancelHref: string };

function Required() {
  return <span className="color:danger">*</span>;
}

export default function CategoryForm({ mode, initial, nextSortOrder, cancelHref }: CategoryFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name")).trim(),
      engName: String(form.get("engName")).trim(),
      sortOrder: Number(form.get("sortOrder")),
      visible: form.get("visible") === "on",
    };

    setPending(true);
    try {
      if (mode === "create") await apiSend("POST", "/api/v1/admin/categories", body);
      else await apiSend("PUT", `/api/v1/admin/categories/${initial.id}`, body);
      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      window.alert((error as Error).message);
      setPending(false);
    }
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
        <button type="submit" className="m3-btn" disabled={pending}>
          {pending ? "저장 중…" : mode === "create" ? "등록하기" : "저장하기"}
        </button>
      </div>
    </form>
  );
}
