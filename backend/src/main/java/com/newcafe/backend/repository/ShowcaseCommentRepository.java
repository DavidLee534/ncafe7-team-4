package com.newcafe.backend.repository;

import com.newcafe.backend.entity.ShowcaseComment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShowcaseCommentRepository extends JpaRepository<ShowcaseComment, Long> {
  @Query("select c from ShowcaseComment c join fetch c.member where c.showcase.id = :showcaseId order by c.createdAt asc, c.id asc")
  List<ShowcaseComment> findByShowcaseIdWithMember(@Param("showcaseId") Long showcaseId);

  Optional<ShowcaseComment> findByIdAndShowcaseId(Long id, Long showcaseId);

}
