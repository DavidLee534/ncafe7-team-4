import AlchemyWorkshop from "../_components/AlchemyWorkshop";

// 연금 공방에 처음 들어오면 재료 연금술부터 보여 준다. ?menu=번호 로 오면 그 메뉴의 계열·기반 재료를 골라 둔 채로 연다.
export default async function AlchemyPage(props: PageProps<"/menu/alchemy">) {
  const { menu } = await props.searchParams;
  const menuId = typeof menu === "string" ? Number(menu) : undefined;
  return <AlchemyWorkshop key={menuId ?? "new"} initialMenuId={menuId} />;
}
