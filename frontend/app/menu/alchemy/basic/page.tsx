import BasicMenuBoard from "../../_components/BasicMenuBoard";
import { getAvailableBasicMenus, getCustomerMenus } from "@/lib/customerMenuApi";

export default async function BasicMenuPage() {
  return <BasicMenuBoard menus={getAvailableBasicMenus(await getCustomerMenus())} />;
}
