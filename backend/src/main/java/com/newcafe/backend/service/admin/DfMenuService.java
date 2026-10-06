package com.newcafe.backend.service.admin;

import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.admin.menu.MenuCreateRequestDto;
import com.newcafe.backend.dto.admin.menu.MenuResponseDto;
import com.newcafe.backend.dto.admin.menu.MenuUpdateRequestDto;
import com.newcafe.backend.entity.Menu;
import com.newcafe.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfMenuService implements MenuService {

  private final MenuRepository menuRepository;

  @Override
  @Transactional
  public MenuResponseDto createMenu(MenuCreateRequestDto request) {
    Menu saved = menuRepository.save(request.toEntity());
    return MenuResponseDto.from(saved);
  }

  @Override
  public List<MenuResponseDto> findAllMenus() {
    return menuRepository.findAll().stream()
        .map(MenuResponseDto::from)
        .toList();
  }

  @Override
  public MenuResponseDto getMenu(Long id) {
    return MenuResponseDto.from(findMenu(id));
  }

  // 조회한 메뉴의 값을 바꾸면 트랜잭션이 끝날 때 UPDATE 된다
  @Override
  @Transactional
  public MenuResponseDto updateMenu(Long id, MenuUpdateRequestDto request) {
    Menu menu = findMenu(id);
    menu.update(request.korName(), request.engName(), request.price());
    return MenuResponseDto.from(menu);
  }

  @Override
  @Transactional
  public void deleteMenu(Long id) {
    menuRepository.delete(findMenu(id));
  }

  // 없는 id면 NotFoundException(404)
  private Menu findMenu(Long id) {
    return menuRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("메뉴를 찾을 수 없습니다: " + id));
  }
}
