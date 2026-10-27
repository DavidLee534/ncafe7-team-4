package com.newcafe.backend.controller.my;

import com.newcafe.backend.dto.my.account.*;
import com.newcafe.backend.service.my.MyPageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/my")
@RequiredArgsConstructor
public class AccountController {
  private final MyPageService service;

  @GetMapping("/account")
  public AccountResponseDto getAccount() { return service.getAccount(); }

  @PutMapping("/account")
  public AccountResponseDto updateAccount(@Valid @RequestBody AccountUpdateRequestDto request) { return service.updateAccount(request); }

  @DeleteMapping("/account")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void withdraw() { service.withdraw(); }

  @GetMapping("/membership")
  public MembershipResponseDto getMembership() { return service.getMembership(); }
}
