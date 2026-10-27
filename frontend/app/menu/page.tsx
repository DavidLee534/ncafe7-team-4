import { redirect } from "next/navigation";

// 손님 메뉴판은 /menus 로 옮겼다 (WBS 3.0). 예전 주소로 들어와도 그쪽으로 보낸다.
export default function CustomerMenuPage() {
  redirect("/menus");
}
