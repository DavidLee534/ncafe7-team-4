package com.newcafe.backend.repository.checkout;

import com.newcafe.backend.entity.Member;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

// 회원 한 행을 잠가 같은 회원의 장바구니 변경과 결제를 순서대로 처리한다.
public interface CheckoutMemberRepository extends Repository<Member, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from Member m where m.id = :id")
    Optional<Member> lockMember(@Param("id") Long id);
}
