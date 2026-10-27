package com.newcafe.backend.controller.my;

import com.newcafe.backend.dto.my.showcase.MyPotionShowcaseListResponseDto;
import com.newcafe.backend.service.my.MyPageService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("myPotionShowcaseController")
@RequestMapping("/api/v1/my")
@RequiredArgsConstructor
public class PotionShowcaseController {
  private final MyPageService service;

  @GetMapping({"/potion-showcases", "/gallery-posts"})
  public List<MyPotionShowcaseListResponseDto> getList(@RequestParam(required = false) Integer size) {
    return service.getShowcases(size);
  }
}
