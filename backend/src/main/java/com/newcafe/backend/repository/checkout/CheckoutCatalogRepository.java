package com.newcafe.backend.repository.checkout;

import com.newcafe.backend.entity.Menu;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface CheckoutCatalogRepository extends Repository<Menu, Long> {
    @Query("select m from Menu m join fetch m.category c where m.status = 'on' and c.visible = true order by m.id")
    List<Menu> availableMenus();
}
