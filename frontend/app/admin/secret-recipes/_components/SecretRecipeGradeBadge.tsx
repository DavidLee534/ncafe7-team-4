// 비밀 레시피 등급 배지 — 희귀 / 전설
import type { SecretRecipeGrade } from "@/lib/adminApi";

export const GRADE_LABEL: Record<SecretRecipeGrade, string> = { rare: "✦ 희귀", legend: "✦✦ 전설" };

export default function SecretRecipeGradeBadge({ grade }: { grade: SecretRecipeGrade }) {
  return (
    <span className={`m3-badge badge:inline badge-color:${grade === "legend" ? "warning" : "primary"}`}>
      {GRADE_LABEL[grade] ?? grade}
    </span>
  );
}
