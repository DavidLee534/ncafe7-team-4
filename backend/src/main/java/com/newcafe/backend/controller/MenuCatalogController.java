package com.newcafe.backend.controller;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.menu.CustomerMenuResponseDto;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.repository.MenuRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuCatalogController {
  private final MenuRepository menus;

  @GetMapping
  public List<CustomerMenuResponseDto> getList() {
    return menus.findAll().stream()
        .filter(this::visible)
        .sorted(Comparator.comparing((Menu menu) -> menu.getCategory() == null ? Integer.MAX_VALUE : menu.getCategory().getSortOrder())
            .thenComparing(Menu::getId))
        .map(CustomerMenuResponseDto::from)
        .toList();
  }

  @GetMapping("/{id}")
  public CustomerMenuResponseDto getDetail(@PathVariable Long id) {
    Menu menu = menus.findById(id)
        .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + id));
    if (!visible(menu)) throw new NotFoundException("메뉴를 찾을 수 없습니다: " + id);
    return CustomerMenuResponseDto.from(menu);
  }

  private boolean visible(Menu menu) {
    return !"hidden".equals(menu.getStatus())
        && (menu.getCategory() == null || menu.getCategory().isVisible());
  }
}
