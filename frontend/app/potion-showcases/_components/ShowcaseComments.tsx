"use client";

import { useEffect, useState, type FormEvent } from "react";
import { memberApi, dateText, type ShowcaseComment } from "@/lib/memberApi";
import styles from "../Showcases.module.css";

export default function ShowcaseComments({ showcaseId }: { showcaseId: number }) {
  const [comments, setComments] = useState<ShowcaseComment[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    memberApi<ShowcaseComment[]>(`/potion-showcases/${showcaseId}/comments`)
      .then(data => { if (active) setComments(data); })
      .catch(cause => { if (active) setError((cause as Error).message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showcaseId]);

  async function submit(event: FormEvent<HTMLFormElement>, parentId: number | null) {
    event.preventDefault();
    const text = parentId === null ? content.trim() : replyContent.trim();
    if (!text || busy) return;
    setBusy(true); setError("");
    try {
      const created = await memberApi<ShowcaseComment>(`/potion-showcases/${showcaseId}/comments`, {
        method: "POST", body: JSON.stringify({ content: text, parentId }),
      });
      setComments(previous => [...previous, created]);
      if (parentId === null) setContent("");
      else { setReplyTo(null); setReplyContent(""); }
    } catch (cause) { setError((cause as Error).message); }
    finally { setBusy(false); }
  }

  async function remove(commentId: number) {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    setBusy(true); setError("");
    try {
      await memberApi<void>(`/potion-showcases/${showcaseId}/comments/${commentId}`, { method: "DELETE" });
      setComments(previous => previous.map(comment => comment.id === commentId
        ? { ...comment, nickname: "삭제됨", content: "삭제된 댓글입니다.", mine: false, deleted: true } : comment));
      if (replyTo === commentId) { setReplyTo(null); setReplyContent(""); }
    } catch (cause) { setError((cause as Error).message); }
    finally { setBusy(false); }
  }

  const roots = comments.filter(comment => comment.parentId === null);
  return <section className={styles.commentSection} aria-labelledby="comments-title">
    <h2 id="comments-title">댓글 {comments.filter(comment => !comment.deleted).length}</h2>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <form className={styles.commentForm} onSubmit={event => submit(event, null)}>
      <label htmlFor="showcase-comment">댓글 작성</label>
      <textarea id="showcase-comment" value={content} onChange={event => setContent(event.target.value)}
        maxLength={1000} rows={3} placeholder="포션에 대한 이야기를 남겨 주세요" required />
      <button className={styles.button} type="submit" disabled={busy || !content.trim()}>댓글 등록</button>
    </form>
    {loading ? <p className={styles.muted}>댓글을 불러오는 중…</p>
      : roots.length === 0 ? <p className={styles.muted}>첫 댓글을 남겨 보세요.</p>
      : <div className={styles.commentList}>{roots.map(root => <div className={styles.commentThread} key={root.id}>
        <CommentRow comment={root} busy={busy} onDelete={remove}
          onReply={() => { setReplyTo(replyTo === root.id ? null : root.id); setReplyContent(""); }} />
        {replyTo === root.id && <form className={styles.commentForm} onSubmit={event => submit(event, root.id)}>
          <label htmlFor={`showcase-reply-${root.id}`}>{root.nickname}님에게 답글</label>
          <textarea id={`showcase-reply-${root.id}`} value={replyContent} onChange={event => setReplyContent(event.target.value)}
            maxLength={1000} rows={2} placeholder="답글을 입력해 주세요" required />
          <div className={styles.commentActions}><button className={styles.button} type="submit" disabled={busy || !replyContent.trim()}>답글 등록</button>
            <button className={styles.secondary} type="button" onClick={() => setReplyTo(null)}>취소</button></div>
        </form>}
        {comments.filter(reply => reply.parentId === root.id).map(reply => <div className={styles.commentReply} key={reply.id}>
          <CommentRow comment={reply} busy={busy} onDelete={remove} />
        </div>)}
      </div>)}</div>}
  </section>;
}

function CommentRow({ comment, busy, onDelete, onReply }: {
  comment: ShowcaseComment; busy: boolean; onDelete: (id: number) => void; onReply?: () => void;
}) {
  return <div className={styles.comment}>
    <div className={styles.commentMeta}><strong>{comment.nickname}</strong><time dateTime={comment.createdAt}>{dateText(comment.createdAt)}</time></div>
    <p className={comment.deleted ? styles.muted : ""}>{comment.content}</p>
    {!comment.deleted && <div className={styles.commentActions}>
      {onReply && <button type="button" onClick={onReply} disabled={busy}>답글</button>}
      {comment.mine && <button type="button" onClick={() => onDelete(comment.id)} disabled={busy}>삭제</button>}
    </div>}
  </div>;
}
