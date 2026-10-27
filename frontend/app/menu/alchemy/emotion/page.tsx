import { redirect } from "next/navigation";

// 감정 연금술은 /recipes/new/emotion 으로 옮겼다. 예전 주소로 들어와도 그쪽으로 보낸다.
export default function EmotionAlchemyPage() {
  redirect("/recipes/new/emotion");
}
