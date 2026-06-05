import React, { useState, useMemo } from 'react';
import { MessageSquare, Send, LogIn } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGetNewsComments, useCreateNewsComment } from '@/services/api/news/newsService';
import { mutater } from '@/services/mutater';
import useAuthStore from '@/stores/useAuthStore';
import { ADMIN_ROLE_CODES } from '@/constants/roles';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };

function CommentItem({
  comment,
  t,
  onDelete,
  replyingToId,
  onReply,
  replyContent,
  onReplyContentChange,
  onReplySubmit,
  onReplyCancel,
  isAuthenticated,
  currentUser,
}) {
  const authorName =
    comment.author_full_name ||
    comment.user_name ||
    comment.author_name ||
    comment.user?.name ||
    comment.user?.username ||
    t('newsPage.comments.anonymous');
  const isOwn =
    currentUser && (comment.user_id === currentUser.id || comment.user?.id === currentUser.id);
  const isReplying = replyingToId === comment.id;

  return (
    <div>
      <article className="border-border/60 bg-card rounded-[14px] border p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={BTN_GRADIENT}
          >
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground text-sm font-semibold">{authorName}</span>
              {comment.created_at && (
                <span className="text-muted-foreground shrink-0 text-xs">
                  {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              {comment.content}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => onReply(isReplying ? null : comment.id)}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground h-6 rounded-[6px] px-2 text-xs"
                >
                  <MessageSquare size={11} className="mr-1" />
                  {t('newsPage.comments.reply')}
                </Button>
              )}
              {isOwn && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => onDelete(comment.id)}
                  className="text-muted-foreground hover:bg-muted hover:text-destructive h-6 rounded-[6px] px-2 text-xs"
                >
                  {t('newsPage.comments.delete')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </article>

      {isReplying && (
        <div className="mt-2 ml-8">
          <div className="border-border/60 bg-muted/60 rounded-[12px] border p-3">
            <Textarea
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              placeholder={t('newsPage.comments.reply_placeholder')}
              maxLength={500}
              className="border-border bg-card focus:border-primary min-h-16 resize-none rounded-[8px] text-sm"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={onReplyCancel}
                className="text-foreground border-border bg-card hover:bg-muted h-7 rounded-[8px] px-3 text-xs font-semibold"
              >
                {t('newsPage.comments.cancel')}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => onReplySubmit(comment.id)}
                disabled={!replyContent.trim()}
                className="h-7 rounded-[8px] px-3 text-xs font-bold text-white hover:text-white disabled:opacity-60"
                style={BTN_GRADIENT}
              >
                <Send size={11} className="mr-1" />
                {t('newsPage.comments.send')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ADMIN_GRADIENT = { background: 'linear-gradient(135deg, #059669, #10b981)' };

function isAdminComment(comment) {
  if (comment.role_code != null) return ADMIN_ROLE_CODES.includes(comment.role_code);
  return Boolean(comment.author_full_name);
}

function AdminReplyItem({ comment, t }) {
  const authorName = comment.author_full_name || t('newsPage.comments.admin');

  return (
    <div className="mt-2 ml-8">
      <article className="relative overflow-hidden rounded-[12px] border border-emerald-200/70 bg-emerald-50/60 p-3">
        <div className="absolute top-0 bottom-0 left-0 w-[3px] rounded-l-[12px] bg-emerald-400" />
        <div className="flex items-start gap-2.5 pl-1.5">
          {comment.author_avatar ? (
            <img
              src={comment.author_avatar}
              alt={authorName}
              className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-emerald-300/60"
            />
          ) : (
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={ADMIN_GRADIENT}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-800">{authorName}</span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                  {t('newsPage.comments.admin_role')}
                </span>
              </div>
              {comment.created_at && (
                <span className="shrink-0 text-xs text-emerald-600/70">
                  {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-emerald-900/80">{comment.content}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

function ReplyItem({ comment, t, onDelete, currentUser }) {
  if (isAdminComment(comment)) {
    return <AdminReplyItem comment={comment} t={t} />;
  }

  const authorName =
    comment.user_name ||
    comment.author_name ||
    comment.user?.name ||
    comment.user?.username ||
    t('newsPage.comments.anonymous');
  const isOwn =
    currentUser && (comment.user_id === currentUser.id || comment.user?.id === currentUser.id);

  return (
    <div className="mt-2 ml-8">
      <article className="border-border/40 bg-muted/40 rounded-[12px] border p-3">
        <div className="flex items-start gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={BTN_GRADIENT}
          >
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground text-xs font-semibold">{authorName}</span>
              {comment.created_at && (
                <span className="text-muted-foreground shrink-0 text-xs">
                  {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{comment.content}</p>
            {isOwn && (
              <Button
                variant="ghost"
                type="button"
                onClick={() => onDelete(comment.id)}
                className="text-muted-foreground hover:bg-muted hover:text-destructive mt-1 h-5 rounded-[6px] px-1.5 text-xs"
              >
                {t('newsPage.comments.delete')}
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function NewsCommentSection({ newsId, t }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const [newComment, setNewComment] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const { data, isLoading } = useGetNewsComments(newsId);

  const allComments = useMemo(() => {
    const raw =
      data?.data?.comments ??
      data?.data?.items ??
      data?.comments ??
      data?.items ??
      (Array.isArray(data?.data) ? data.data : null) ??
      [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const { rootComments, repliesMap } = useMemo(() => {
    const roots = [];
    const repMap = {};
    allComments.forEach((c) => {
      if (c.parent_comment_id) {
        if (!repMap[c.parent_comment_id]) repMap[c.parent_comment_id] = [];
        repMap[c.parent_comment_id].push(c);
      } else {
        roots.push(c);
      }
    });
    return { rootComments: roots, repliesMap: repMap };
  }, [allComments]);

  const createComment = useCreateNewsComment(newsId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news', 'comments', newsId] });
      setNewComment('');
      setReplyContent('');
      setReplyingToId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) => mutater(`news/${newsId}/comments/${commentId}`, 'DELETE'),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['news', 'comments', newsId] });
      if (res?.message) toast.success(res.message);
    },
    onError: (err) => {
      toast.error(err?.message || t('newsPage.comments.error'));
    },
  });

  function handleSubmit() {
    const content = newComment.trim();
    if (!content) return;
    createComment.mutate({ content, parent_comment_id: null });
  }

  function handleReplySubmit(parentId) {
    const content = replyContent.trim();
    if (!content) return;
    createComment.mutate({ content, parent_comment_id: parentId });
  }

  function handleReplyCancel() {
    setReplyingToId(null);
    setReplyContent('');
  }

  const total = allComments.length;

  return (
    <section className="border-border/70 bg-card rounded-[18px] border shadow-sm">
      <div className="px-6 py-5">
        <h2 className="text-foreground mb-4 flex items-center gap-2 text-sm font-bold 2xl:text-base">
          <MessageSquare size={16} className="text-primary" />
          {t('newsPage.comments.title')}
          {total > 0 && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
              {total}
            </span>
          )}
        </h2>

        {/* Comment list */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-20 animate-pulse rounded-[14px]" />
            ))
          ) : rootComments.length > 0 ? (
            rootComments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  t={t}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  replyingToId={replyingToId}
                  onReply={setReplyingToId}
                  replyContent={replyContent}
                  onReplyContentChange={setReplyContent}
                  onReplySubmit={handleReplySubmit}
                  onReplyCancel={handleReplyCancel}
                  isAuthenticated={isAuthenticated}
                  currentUser={user}
                />
                {(comment.replies?.length ? comment.replies : repliesMap[comment.id] || []).map(
                  (reply) => (
                    <ReplyItem
                      key={reply.id}
                      comment={reply}
                      t={t}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      currentUser={user}
                    />
                  )
                )}
              </div>
            ))
          ) : (
            <div className="bg-muted rounded-[14px] px-4 py-8 text-center">
              <MessageSquare size={28} className="text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">{t('newsPage.comments.empty')}</p>
            </div>
          )}
        </div>

        {/* Create / login form */}
        <div className="mt-5">
          {isAuthenticated ? (
            <div className="border-border/60 bg-muted/60 rounded-[14px] border p-4">
              <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                {t('newsPage.comments.write')}
              </h3>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('newsPage.comments.placeholder')}
                maxLength={500}
                className="border-border bg-card focus:border-primary min-h-20 resize-none rounded-[10px] text-sm"
              />
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground text-xs">{newComment.length}/500</span>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || createComment.isPending}
                  className="flex h-8 items-center gap-1.5 rounded-[10px] px-4 text-sm font-bold text-white hover:text-white disabled:opacity-60"
                  style={BTN_GRADIENT}
                >
                  <Send size={13} />
                  {createComment.isPending
                    ? t('newsPage.comments.sending')
                    : t('newsPage.comments.submit')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted/60 rounded-[14px] px-4 py-5 text-center">
              <p className="text-muted-foreground text-sm">{t('newsPage.comments.login_prompt')}</p>
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate('/login')}
                className="mx-auto mt-2.5 flex h-8 items-center gap-1.5 rounded-[10px] px-4 text-sm font-semibold text-white hover:text-white"
                style={BTN_GRADIENT}
              >
                <LogIn size={14} />
                {t('newsPage.comments.login_btn')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
