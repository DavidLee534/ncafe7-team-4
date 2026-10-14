import AlchemyWorkshop from "../../_components/AlchemyWorkshop";

// ?menu=번호 로 오면 그 메뉴의 계열·기반 재료를 골라 둔 채로 연다.
export default async function MaterialAlchemyPage(props: PageProps<"/menu/alchemy/material">) {
  const { menu } = await props.searchParams;
  const menuId = typeof menu === "string" ? Number(menu) : undefined;
  return <AlchemyWorkshop key={menuId ?? "new"} initialMenuId={menuId} />;
}
