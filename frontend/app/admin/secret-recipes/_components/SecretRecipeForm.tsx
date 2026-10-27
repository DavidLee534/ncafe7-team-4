"use client";
// 비밀 레시피 등록·수정 공용 폼. 제출하면 백엔드에 POST(등록) / PUT(수정)을 보내고 상세(수정) 또는 목록(등록)으로 간다.
// 이름이 겹치면 백엔드가 409 로 거절하고, 그 메시지를 알림으로 띄운다.
// 재료 조합은 재료 관리가 머지된 뒤 이 폼에 추가한다.
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SecretRecipeDetail } from "@/lib/adminApi";
import { apiSend } from "@/lib/apiClient";

type Props = {
  mode: "create" | "edit";
  initial?: SecretRecipeDetail;
  categories: { id: number; name: string }[];
  cancelHref: string;
};

function Required() {
  return <span className="color:danger">*</span>;
}

export default function SecretRecipeForm({ mode, initial, categories, cancelHref }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [color, setColor] = useState(initial?.color ?? "#d9a03c");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    const body = {
      name: text("name"),
      grade: text("grade"),
      categoryId: Number(form.get("categoryId")),
      color,
      description: text("description") || null,
      riddle: text("riddle") || null,
      visible: form.get("visible") === "on",
    };

    setPending(true);
    try {
      if (mode === "create") {
        await apiSend("POST", "/api/v1/admin/secret-recipes", body);
        router.push("/admin/secret-recipes");
      } else {
        await apiSend("PUT", `/api/v1/admin/secret-recipes/${initial!.id}`, body);
        router.push(`/admin/secret-recipes/${initial!.id}`);
      }
      router.refresh();
    } catch (error) {
      window.alert((error as Error).message);
      setPending(false);
    }
  }

  return (
    <form className="m3-form max-width:ex" style={{ "--max-width-ex": "40rem" }} onSubmit={handleSubmit}>
      <section className="m3-section section:card">
        <h2 className="section-title">레시피 정보</h2>
        <div className="form-fields">
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="name">
              레시피 이름 <Required />
            </label>
            <input id="name" name="name" type="text" placeholder="예) 대연금술사의 황금 꼬리" defaultValue={initial?.name} maxLength={30} required />
          </div>
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="grade">
              등급 <Required />
            </label>
            <select id="grade" name="grade" defaultValue={initial?.grade ?? "rare"} required>
              <option value="rare">✦ 희귀</option>
              <option value="legend">✦✦ 전설</option>
            </select>
          </div>
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="categoryId">
              계열 <Required />
            </label>
            <select id="categoryId" name="categoryId" defaultValue={initial?.categoryId ?? ""} required>
              <option value="" disabled>
                계열을 고르세요
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="color">
              포션 색 <Required />
            </label>
            <div className="display:flex align-items:center gap:2">
              <input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                aria-label="포션 색 고르기"
                style={{ width: "3rem", height: "2.5rem", padding: 0, border: 0, background: "none" }}
              />
              <code>{color}</code>
            </div>
          </div>
        </div>
      </section>

      <section className="m3-section section:card">
        <h2 className="section-title">도감 문구</h2>
        <div className="form-fields">
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="riddle">모카 점장의 수수께끼 (발견 전에 보임)</label>
            <textarea id="riddle" name="riddle" rows={3} maxLength={500} defaultValue={initial?.riddle ?? ""} placeholder="예) 검은 원두에 하얀 꽃의 향 하나면 된다냥." />
          </div>
          <div className="m3-text-field field:outlined field-label:top">
            <label htmlFor="description">설명 (발견한 뒤 보임)</label>
            <textarea id="description" name="description" rows={3} maxLength={1000} defaultValue={initial?.description ?? ""} placeholder="예) 빛과 어둠이 한 잔 안에서 균형을 이루는 포션이에요." />
          </div>
          <div className="form-group">
            <label className="m3-switch">
              <input type="checkbox" name="visible" defaultChecked={initial?.visible ?? true} />
              <span className="switch-label">손님 도감에 공개</span>
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
