import EmotionAlchemyWorkshop from "../../_components/EmotionAlchemyWorkshop";
import { getAvailableBasicMenus, getCustomerMenus } from "@/lib/customerMenuApi";

export default async function EmotionAlchemyPage() {
  return <EmotionAlchemyWorkshop menus={getAvailableBasicMenus(await getCustomerMenus())} />;
}
