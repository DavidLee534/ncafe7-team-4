import type { Metadata } from "next";
import RecipeCodex from "./_components/RecipeCodex";

export const metadata: Metadata = { title: "레시피 도감" };

export default function RecipeCodexPage() {
  return <RecipeCodex />;
}
