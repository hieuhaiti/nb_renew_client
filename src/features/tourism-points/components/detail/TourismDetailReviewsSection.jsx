import React from 'react';
import { Star, ThumbsUp, BadgeCheck, MessageSquare, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };
const BAR_GRADIENT = 'linear-gradient(135deg, #0b66c3, #0ea5e9)';

function StarsDisplay({ count, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < count
              ? 'fill-[#d99200] text-[#d99200]'
              : 'fill-[#d99200] text-[#d99200] opacity-20'
          }
        />
      ))}
    </div>
  );
}

function StarPicker({ value, hover, onValue, onHover, size = 'h-6 w-6' }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, idx) => (
        <button
          key={idx}
          type="button"
          onMouseEnter={() => onHover(idx + 1)}
          onMouseLeave={() => onHover(0)}
          onClick={() => onValue(idx + 1)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`${size} transition-colors ${
              idx < (hover || value)
                ? 'fill-[#d99200] text-[#d99200]'
                : 'fill-[#d99200] text-[#d99200] opacity-20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ r, computeDisplayRating, onDeleteReview, t }) {
  const starCount = computeDisplayRating(r);
  const userName = r.user_name || r.user?.name || r.author || t('tourism.anonymous', 'Khách');
  const photoUrls = Array.isArray(r.photo_urls) ? r.photo_urls.filter(Boolean) : [];
  const dateStr = r.visit_date || r.created_at;

  return (
    <article className="rounded-[14px] border border-[#cfe0f4] bg-white p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={BTN_GRADIENT}
        >
          {userName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-foreground text-sm font-semibold"
                  title={userName}
                >
                  {userName}
                </span>
                {r.is_verified_visit && (
                  <BadgeCheck size={14} className="shrink-0 text-[#10b981]" />
                )}
              </div>
              {starCount > 0 && (
                <div className="mt-0.5">
                  <StarsDisplay count={starCount} size={12} />
                </div>
              )}
            </div>
            {dateStr && (
              <span className="text-muted-foreground shrink-0 text-xs">
                {new Date(dateStr).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>

          {/* Title */}
          {r.title && (
            <p className="text-foreground mt-2 text-sm font-semibold">{r.title}</p>
          )}

          {/* Content */}
          {(r.content || r.comment || r.body) && (
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              {r.content || r.comment || r.body}
            </p>
          )}

          {/* Pros / Cons */}
          {(r.pros || r.cons) && (
            <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
              {r.pros && (
                <div className="rounded-[8px] bg-[#f0fdf4] px-3 py-2 text-xs text-[#059669]">
                  <span className="font-semibold">+ </span>
                  {r.pros}
                </div>
              )}
              {r.cons && (
                <div className="rounded-[8px] bg-[#fff7ed] px-3 py-2 text-xs text-[#d97706]">
                  <span className="font-semibold">- </span>
                  {r.cons}
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {photoUrls.length > 0 && (
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto">
              {photoUrls.map((src, idx) => (
                <img
                  key={idx}
                  src={withBaseUrl(src)}
                  alt={`review-photo-${idx}`}
                  className="h-14 w-20 shrink-0 rounded-[8px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            {r.helpful_count > 0 ? (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <ThumbsUp size={11} />
                {r.helpful_count} {t('tourism.helpful', 'hữu ích')}
              </span>
            ) : (
              <span />
            )}
            {r.can_delete && (
              <button
                type="button"
                onClick={() => onDeleteReview(r.id)}
                className="h-6 rounded-[6px] border border-[#cfe0f4] bg-white px-2 text-xs text-muted-foreground hover:bg-[#eef7ff]"
              >
                {t('tourism.delete', 'Xoá')}
              </button>
            )}
          </div>

          {/* Reply */}
          {r.reply_text && (
            <div className="mt-2.5 rounded-[10px] border border-[#cfe0f4] bg-[#eef7ff] p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#0b66c3]">
                <MessageSquare size={11} />
                {r.reply_by_name || t('tourism.operator_reply', 'Phản hồi từ đơn vị')}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{r.reply_text}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function TourismDetailReviewsSection({
  t,
  averageDisplayRating,
  totalReviewCount,
  starCounts,
  isLoading,
  reviews,
  computeDisplayRating,
  onDeleteReview,
  pageDisplay,
  pagesDisplay,
  reviewPage,
  onPrevPage,
  onNextPage,
  newStars,
  hoverStars,
  onStarsChange,
  onHoverStars,
  newTitle,
  onTitleChange,
  newVisitDate,
  onVisitDateChange,
  newComment,
  onCommentChange,
  newPros,
  onProsChange,
  newCons,
  onConsChange,
  onSelectFiles,
  previews,
  onRemoveFile,
  onReset,
  onSubmit,
  isSubmitting,
}) {
  return (
    <section className="border-border bg-card mb-3 rounded-[16px] border px-5 py-4">
      <h2 className="text-foreground mb-4 text-base font-bold">
        {t('tourism.reviews', 'Đánh giá')}
      </h2>

      {/* Summary */}
      <div className="mb-4 rounded-[14px] border border-[#cfe0f4] bg-[#eef7ff] p-4">
        <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-black leading-none text-[#0b66c3]">
              {averageDisplayRating > 0 ? averageDisplayRating.toFixed(1) : '—'}
            </div>
            <div className="mt-1.5">
              <StarsDisplay count={Math.round(averageDisplayRating)} size={14} />
            </div>
            <div className="text-muted-foreground mt-1 text-center text-xs">
              {totalReviewCount} {t('tourism.reviews_count', 'đánh giá')}
            </div>
          </div>

          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = Number(starCounts[score] ?? 0);
              const ratio =
                totalReviewCount > 0
                  ? (count / Math.max(1, totalReviewCount)) * 100
                  : 0;
              return (
                <div
                  key={score}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span className="w-3 shrink-0 text-right font-medium">{score}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${ratio}%`, background: BAR_GRADIENT }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-[14px] border border-[#cfe0f4] bg-[#f8fbff]"
            />
          ))
        ) : reviews.length > 0 ? (
          reviews.map((r) => (
            <ReviewCard
              key={r.id}
              r={r}
              computeDisplayRating={computeDisplayRating}
              onDeleteReview={onDeleteReview}
              t={t}
            />
          ))
        ) : (
          <div className="rounded-[14px] border border-[#cfe0f4] bg-[#f8fbff] px-4 py-6 text-center text-sm text-muted-foreground">
            {t('tourism.no_reviews', 'Chưa có đánh giá nào.')}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagesDisplay > 1 && (
        <div className="mt-3 mb-4 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {t('tourism.page', 'Trang')} {pageDisplay} / {pagesDisplay}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={reviewPage <= 1}
              onClick={onPrevPage}
              className="flex h-7 items-center gap-1 rounded-[8px] border border-[#cfe0f4] bg-white px-2.5 text-xs font-semibold text-foreground disabled:opacity-40 hover:bg-[#eef7ff]"
            >
              <ChevronLeft size={13} />
              {t('common.prev', 'Trước')}
            </button>
            <button
              type="button"
              disabled={reviewPage >= pagesDisplay}
              onClick={onNextPage}
              className="flex h-7 items-center gap-1 rounded-[8px] border border-[#cfe0f4] bg-white px-2.5 text-xs font-semibold text-foreground disabled:opacity-40 hover:bg-[#eef7ff]"
            >
              {t('common.next', 'Sau')}
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Write review form */}
      <div className="mt-4 rounded-[14px] border border-[#cfe0f4] bg-[#f8fbff] p-4">
        <h3 className="text-foreground mb-4 text-sm font-bold">
          {t('tourism.write_your_review', 'Viết đánh giá của bạn')}
        </h3>

        {/* Star picker */}
        <div className="mb-4 flex items-center justify-between rounded-[10px] border border-[#cfe0f4] bg-white px-3 py-2.5">
          <span className="text-foreground text-sm">
            {t('tourism.your_rating', 'Số sao đánh giá')}{' '}
            <span className="text-red-500">*</span>
          </span>
          <StarPicker
            value={newStars}
            hover={hoverStars}
            onValue={onStarsChange}
            onHover={onHoverStars}
            size="h-6 w-6"
          />
        </div>

        {/* Title + Visit date */}
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label
              htmlFor="review-title"
              className="text-muted-foreground mb-1 block text-xs font-medium"
            >
              {t('tourism.review_title', 'Tiêu đề (tuỳ chọn)')}
            </label>
            <Input
              id="review-title"
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t(
                'tourism.review_title_placeholder',
                'Tóm tắt trải nghiệm của bạn...'
              )}
              className="h-9 rounded-[8px] border-[#cfe0f4] bg-white text-sm focus:border-[#0b66c3]"
            />
          </div>
          <div>
            <label
              htmlFor="visit-date"
              className="text-muted-foreground mb-1 block text-xs font-medium"
            >
              {t('tourism.visit_date', 'Ngày tham quan')}
            </label>
            <Input
              id="visit-date"
              type="date"
              value={newVisitDate}
              onChange={(e) => onVisitDateChange(e.target.value)}
              className="h-9 rounded-[8px] border-[#cfe0f4] bg-white text-sm focus:border-[#0b66c3]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <label
            htmlFor="review-comment"
            className="text-muted-foreground mb-1 block text-xs font-medium"
          >
            {t('tourism.your_comment', 'Cảm nhận của bạn')}
          </label>
          <Textarea
            id="review-comment"
            value={newComment}
            maxLength={500}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder={t(
              'tourism.leave_comment_placeholder',
              'Chia sẻ trải nghiệm của bạn về địa điểm này...'
            )}
            className="min-h-20 resize-none rounded-[8px] border-[#cfe0f4] bg-white text-sm focus:border-[#0b66c3]"
          />
        </div>

        {/* Pros / Cons */}
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label
              htmlFor="review-pros"
              className="text-muted-foreground mb-1 block text-xs font-medium"
            >
              {t('tourism.pros', 'Điểm tích cực')}
            </label>
            <Input
              id="review-pros"
              value={newPros}
              onChange={(e) => onProsChange(e.target.value)}
              placeholder={t('tourism.pros_placeholder', 'Điểm bạn thích...')}
              className="h-9 rounded-[8px] border-[#cfe0f4] bg-white text-sm focus:border-[#0b66c3]"
            />
          </div>
          <div>
            <label
              htmlFor="review-cons"
              className="text-muted-foreground mb-1 block text-xs font-medium"
            >
              {t('tourism.cons', 'Điểm cần cải thiện')}
            </label>
            <Input
              id="review-cons"
              value={newCons}
              onChange={(e) => onConsChange(e.target.value)}
              placeholder={t('tourism.cons_placeholder', 'Điểm chưa hài lòng...')}
              className="h-9 rounded-[8px] border-[#cfe0f4] bg-white text-sm focus:border-[#0b66c3]"
            />
          </div>
        </div>

        {/* Photo upload */}
        <div className="mb-4">
          <label
            htmlFor="review-file-input"
            className="text-muted-foreground mb-1.5 block text-xs font-medium"
          >
            {t('tourism.upload_photos', 'Tải ảnh (tối đa 5 ảnh)')}
          </label>
          <div
            className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#cfe0f4] bg-white text-sm text-muted-foreground transition hover:bg-[#eef7ff]"
            onClick={() => document.getElementById('review-file-input')?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('review-file-input')?.click();
              }
            }}
          >
            <Plus size={14} className="text-[#0b66c3]" />
            {t('tourism.upload_hint', 'Nhấn để chọn ảnh')}
            <input
              id="review-file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={onSelectFiles}
              className="hidden"
            />
          </div>

          {previews.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {previews.map((u, i) => (
                <div key={i} className="group relative h-16 w-20 overflow-hidden rounded-[8px]">
                  <img src={u} alt={`preview-${i}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemoveFile(i)}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="h-9 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold text-foreground hover:bg-[#eef7ff]"
          >
            {t('tourism.cancel', 'Huỷ')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-9 rounded-[10px] px-5 text-sm font-bold text-white disabled:opacity-60"
            style={BTN_GRADIENT}
          >
            {isSubmitting
              ? t('tourism.sending', 'Đang gửi...')
              : t('tourism.submit_review', 'Gửi đánh giá')}
          </button>
        </div>
      </div>
    </section>
  );
}
