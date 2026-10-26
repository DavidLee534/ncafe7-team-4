package com.newcafe.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 회원. 인증을 붙이기 전까지는 1번 회원을 "현재 회원"으로 쓴다 (common/auth/CurrentMember)
// 멤버십 등급은 컬럼으로 두지 않고 주문 수로 계산한다 (5회 이상, 20회 이상)
@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  // id

  @Column(nullable = false, unique = true)
  private String email; // 로그인 아이디

  @Column(nullable = false)
  private String password; // 비밀번호 해시. 인증 시스템에서 암호화해 넣는다

  @Column(nullable = false)
  private String nickname; // 화면에 보이는 이름

  @Column(nullable = false)
  private String role; // member(회원) / admin(관리자)

  @Column(nullable = false)
  private String status; // active(정상) / suspended(정지). 관리자가 바꾼다

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;  // 가입일

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;  // 수정일

  @Builder
  private Member(String email, String password, String nickname, String role, String status) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.role = role != null ? role : "member";
    this.status = status != null ? status : "active";
  }

  // 마이페이지 "회원 정보 수정"
  public void updateAccount(String nickname) {
    this.nickname = nickname;
    this.updatedAt = LocalDateTime.now();
  }

  // 관리자 "회원 상태 변경" (정상 ↔ 정지)
  public void changeStatus(String status) {
    this.status = status;
    this.updatedAt = LocalDateTime.now();
  }

  @PrePersist
  private void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
