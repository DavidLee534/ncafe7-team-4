"use client";
// 카테고리 표 — 순서 변경 · 수정 · 삭제(목업).
// "순서 변경"을 누르면 순서 변경 모드가 되어 ▲▼ 버튼과 ⠿ 손잡이(끌어 놓기)가 나온다. 취소하면 원래 순서로 돌아간다.
// "순서 저장"을 누르면 바뀐 순서를 안내만 한다(목업). 저장 API가 생기면 handleSave 에서 보낸다.
import { useState, type DragEvent } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import MockActionButton from "../../_components/MockActionButton";
import styles from "./CategoryOrderTable.module.css";

export type CategoryRow = Category & { menuCount: number };

export default function CategoryOrderTable({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const [saved, setSaved] = useState(categories); // 마지막으로 저장한 순서
  const [rows, setRows] = useState(categories);
  const [editing, setEditing] = useState(false); // 순서 변경 모드
  const [dragId, setDragId] = useState<number | null>(null);
  const changed = rows.some((row, index) => row.id !== saved[index].id);

  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length || from === to) return;
    setRows((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  // 끌고 있는 줄이 다른 줄 위로 지나가면 그 자리로 옮긴다
  function handleDragOver(
    e: DragEvent<HTMLTableRowElement>,
    overIndex: number,
  ) {
    if (dragId === null) return;
    e.preventDefault();
    const from = rows.findIndex((row) => row.id === dragId);
    if (from !== overIndex) move(from, overIndex);
  }

  function handleCancel() {
    setRows(saved);
    setEditing(false);
  }

  function handleSave() {
    if (changed) {
      const order = rows
        .map((row, index) => `${index + 1}. ${row.name}`)
        .join("\n");
      if (!window.confirm(`이 순서로 저장할까요?\n\n${order}`)) return;
      window.alert("목업 화면이라 실제로 반영되지 않습니다.");
      setSaved(rows);
    }
    setEditing(false);
  }

  return (
    <section className="m3-card card:outlined" aria-label="카테고리 표">
      <div
        className={`${styles.toolbar} ${editing ? styles.toolbarEditing : ""}`}
        role="status"
      >
        {editing ? (
          <>
            <span>
              순서를 바꾸는 중이에요. ▲▼ 버튼이나 ⠿ 손잡이를 끌어서 옮긴 뒤
              저장하세요.
            </span>
            <button
              type="button"
              className="m3-btn btn:text btn-size:xs"
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type="button"
              className="m3-btn btn-size:xs"
              onClick={handleSave}
            >
              {changed ? "순서 저장" : "완료"}
            </button>
          </>
        ) : (
          <>
            <span>사용자 화면의 카테고리 탭은 이 순서대로 나와요.</span>
            <button
              type="button"
              className="m3-btn btn:outlined btn-size:xs"
              onClick={() => setEditing(true)}
            >
              ⇅ 순서 변경
            </button>
          </>
        )}
      </div>
      <table className="m3-table">
        <thead>
          <tr>
            <th scope="col">순서</th>
            <th scope="col">카테고리</th>
            <th scope="col" className="table-align:end">
              메뉴 수
            </th>
            <th scope="col">공개</th>
            <th scope="col">등록일</th>
            <th scope="col">관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, index) => (
            <tr
              key={c.id}
              className={`${styles.row} ${dragId === c.id ? styles.dragging : ""}`}
              onDragOver={editing ? (e) => handleDragOver(e, index) : undefined}
              onDrop={editing ? (e) => e.preventDefault() : undefined}
            >
              <td>
                <div className={styles.order}>
                  {editing && (
                    <span
                      className={styles.handle}
                      draggable
                      onDragStart={(e) => {
                        setDragId(c.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => setDragId(null)}
                      title="끌어서 순서 바꾸기"
                      aria-hidden="true"
                    >
                      ⠿
                    </span>
                  )}
                  <span className={styles.number}>{index + 1}</span>
                  {editing && (
                    <>
                      <button
                        type="button"
                        className={styles.arrow}
                        onClick={() => move(index, index - 1)}
                        disabled={index === 0}
                        aria-label={`${c.name} 위로`}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className={styles.arrow}
                        onClick={() => move(index, index + 1)}
                        disabled={index === rows.length - 1}
                        aria-label={`${c.name} 아래로`}
                      >
                        ▼
                      </button>
                    </>
                  )}
                </div>
              </td>
              <td>
                <span className="font-weight:semibold">{c.name}</span>
                <p className="font-size:caption color:text-muted">
                  {c.engName}
                </p>
              </td>
              <td className="table-align:end">
                <Link
                  href={`/admin/menus?category=${c.id}`}
                  className="color:link"
                >
                  {c.menuCount}개
                </Link>
              </td>
              <td>
                <span
                  className={`m3-badge badge:inline badge-color:${c.visible ? "success" : "neutral"}`}
                >
                  {c.visible ? "공개" : "숨김"}
                </span>
              </td>
              <td className="color:text-muted">{c.createdAt}</td>
              <td>
                <div className="display:flex gap:1">
                  {/* 순서 변경 중에는 실수로 누르지 않게 수정 · 삭제를 잠시 끈다 */}
                  {editing ? (
                    <span
                      className="m3-btn btn:text btn-size:xs"
                      aria-disabled="true"
                    >
                      수정
                    </span>
                  ) : (
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="m3-btn btn:text btn-size:xs"
                    >
                      수정
                    </Link>
                  )}
                  <MockActionButton
                    confirmMessage={`'${c.name}' 카테고리를 삭제할까요?`}
                    className="m3-btn btn:text btn-color:danger btn-size:xs"
                    disabled={editing || c.menuCount > 0}
                    title={
                      c.menuCount > 0
                        ? "메뉴가 있는 카테고리는 삭제할 수 없습니다"
                        : undefined
                    }
                  >
                    삭제
                  </MockActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
