package com.newcafe.backend.service;

import com.newcafe.backend.common.auth.CurrentMember;
import com.newcafe.backend.common.exception.ForbiddenException;
import com.newcafe.backend.common.exception.NotFoundException;
import com.newcafe.backend.dto.showcase.ShowcaseCommentCreateRequestDto;
import com.newcafe.backend.dto.showcase.ShowcaseCommentResponseDto;
import com.newcafe.backend.entity.Member;
import com.newcafe.backend.entity.ShowcaseComment;
import com.newcafe.backend.repository.MemberRepository;
import com.newcafe.backend.repository.PotionShowcaseRepository;
import com.newcafe.backend.repository.ShowcaseCommentRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DfShowcaseCommentService implements ShowcaseCommentService {
  private final ShowcaseCommentRepository comments;
  private final PotionShowcaseRepository showcases;
  private final MemberRepository members;
  private final CurrentMember currentMember;

  public List<ShowcaseCommentResponseDto> getList(Long showcaseId) {
    var member = activeMember();
    findShowcase(showcaseId);
    return comments.findByShowcaseIdWithMember(showcaseId).stream().map(c -> response(c, member.getId())).toList();
  }

  @Transactional
  public ShowcaseCommentResponseDto create(Long showcaseId, ShowcaseCommentCreateRequestDto request) {
    var member = activeMember();
    var showcase = findShowcase(showcaseId);
    ShowcaseComment parent = null;
    if (request.parentId() != null) {
      parent = comments.findByIdAndShowcaseId(request.parentId(), showcaseId)
          .orElseThrow(() -> new NotFoundException("답글을 달 댓글을 찾을 수 없습니다."));
      if (parent.getParent() != null) throw new IllegalArgumentException("대댓글에는 답글을 달 수 없습니다.");
      if (parent.isDeleted()) throw new IllegalStateException("삭제된 댓글에는 답글을 달 수 없습니다.");
    }
    var saved = comments.save(ShowcaseComment.builder().showcase(showcase).member(member).parent(parent)
        .content(request.content().trim()).build());
    return response(saved, member.getId());
  }

  @Transactional
  public void delete(Long showcaseId, Long commentId) {
    var member = activeMember();
    var comment = comments.findByIdAndShowcaseId(commentId, showcaseId)
        .orElseThrow(() -> new NotFoundException("댓글을 찾을 수 없습니다."));
    if (!comment.getMember().getId().equals(member.getId()))
      throw new ForbiddenException("작성자만 댓글을 삭제할 수 있습니다.");
    comment.delete();
  }

  private ShowcaseCommentResponseDto response(ShowcaseComment c, Long memberId) {
    return new ShowcaseCommentResponseDto(c.getId(), c.getParent() == null ? null : c.getParent().getId(),
        c.isDeleted() ? "삭제됨" : c.getMember().getNickname(),
        c.isDeleted() ? "삭제된 댓글입니다." : c.getContent(), c.getCreatedAt(),
        !c.isDeleted() && c.getMember().getId().equals(memberId), c.isDeleted());
  }

  private Member activeMember() {
    var member = members.findById(currentMember.id())
        .orElseThrow(() -> new NotFoundException("회원을 찾을 수 없습니다."));
    if (!"active".equals(member.getStatus())) throw new ForbiddenException("활성 회원만 이용할 수 있습니다.");
    return member;
  }

  private com.newcafe.backend.entity.PotionShowcase findShowcase(Long id) {
    return showcases.findById(id).orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다: " + id));
  }
}
