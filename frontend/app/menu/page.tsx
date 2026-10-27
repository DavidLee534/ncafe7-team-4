import UserMenuCatalog from "./_components/UserMenuCatalog";
import { getCustomerMenus, toBookMenu } from "@/lib/customerMenuApi";

export default async function CustomerMenuPage() {
  const catalog = await getCustomerMenus();
  const categories = [...new Map(catalog.filter(menu => menu.categoryId != null)
    .map(menu => [menu.categoryId!, { id: menu.categoryId!, name: menu.categoryName ?? "기타", sortOrder: menu.categorySortOrder ?? 999 }])).values()]
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return <UserMenuCatalog menus={catalog.map(toBookMenu)} categories={categories} />;
}
