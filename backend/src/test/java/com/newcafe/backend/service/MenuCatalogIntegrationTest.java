package com.newcafe.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.controller.MenuCatalogController;
import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.repository.CategoryRepository;
import com.newcafe.backend.repository.MenuRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:menu_catalog_it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.sql.init.mode=never"
})
@Transactional
class MenuCatalogIntegrationTest {
  @Autowired private MenuCatalogController catalog;
  @Autowired private CategoryRepository categories;
  @Autowired private MenuRepository menus;

  @Test
  void customerCatalogReflectsPriceAndAvailability() {
    Category category = categories.save(Category.builder().name("커피").engName("Coffee")
        .sortOrder(1).visible(true).build());
    Menu menu = menus.save(Menu.builder().korName("라떼").engName("Latte").price(4000)
        .category(category).status("on").build());
    Menu hidden = menus.save(Menu.builder().korName("비공개").engName("Hidden").price(5000)
        .category(category).status("hidden").build());

    assertEquals(1, catalog.getList().size());
    assertThrows(NotFoundException.class, () -> catalog.getDetail(hidden.getId()));

    menu.update("라떼", "Latte", 4500, category, "soldout", false, null, null, null, null);
    assertEquals(4500, catalog.getDetail(menu.getId()).price());
    assertEquals("soldout", catalog.getDetail(menu.getId()).status());

    category.update("커피", "Coffee", 1, false);
    assertEquals(0, catalog.getList().size());
    assertThrows(NotFoundException.class, () -> catalog.getDetail(menu.getId()));
  }
}
