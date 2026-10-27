import { redirect } from "next/navigation";

// 연금 공방은 /recipes/new 로 옮겼다 (WBS 4.0). 메뉴 상세의 "조합하기"(?menu=번호)는 그 메뉴를 기반으로 골라 둔 채 연다.
export default async function AlchemyPage(props: PageProps<"/menu/alchemy">) {
  const { menu } = await props.searchParams;
  redirect(typeof menu === "string" ? `/recipes/new?menuId=${encodeURIComponent(menu)}` : "/recipes/new");
}
