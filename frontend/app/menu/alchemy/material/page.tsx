import { redirect } from "next/navigation";

// 재료 연금술은 /recipes/new 로 옮겼다. 예전 주소로 들어와도 그쪽으로 보낸다.
export default function MaterialAlchemyPage() {
  redirect("/recipes/new");
}
