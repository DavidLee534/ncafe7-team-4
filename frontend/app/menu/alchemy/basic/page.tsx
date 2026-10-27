import { redirect } from "next/navigation";

// 기본 메뉴 고르기는 /recipes/new/from-menu 로 옮겼다. 예전 주소로 들어와도 그쪽으로 보낸다.
export default function BasicMenuPage() {
  redirect("/recipes/new/from-menu");
}
