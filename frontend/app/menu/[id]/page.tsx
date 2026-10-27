import { redirect } from "next/navigation";
import { getMenus } from "@/lib/userApi";

// 메뉴 상세는 /menus/{slug} 로 옮겼다. 예전 번호 주소(/menu/3)로 들어오면 그 메뉴의 slug 주소로 보낸다.
export default async function LegacyMenuDetailPage(props: PageProps<"/menu/[id]">) {
  const { id } = await props.params;
  const menu = (await getMenus()).find((item) => item.id === Number(id));
  redirect(menu ? `/menus/${menu.slug}` : "/menus");
}
