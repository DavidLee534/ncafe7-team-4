package com.newcafe.backend.repository.checkout;

import com.newcafe.backend.entity.Recipe;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface CheckoutRecipeRepository extends Repository<Recipe, Long> {
    @Query("select r from Recipe r join fetch r.baseMenu m join fetch m.category where r.member.id = :memberId order by r.id")
    List<Recipe> ownRecipes(@Param("memberId") Long memberId);
}
