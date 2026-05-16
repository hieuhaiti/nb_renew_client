import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
            i < count ? 'fill-[#d99200] text-[#d99200]' : 'fill-[#d99200] text-[#d99200] opacity-20'
          }
        />
      ))}
    </div>
  );
}

function TourReviewCard({ r, t }) {
  const stars = Number(r.stars || r.rating || 0);
  const userName = r.user_name || r.user?.name || r.author || t('tourPage.guest', 'Khách');
  const dateStr = r.created_at || r.createdAt || r.date;

  const subRatings = [
    { label: t('tourPage.cleanliness', 'Sạch sẽ'), value: Number(r.cleanliness_rating ?? 0) },
    { label: t('tourPage.service', 'Dịch vụ'), value: Number(r.service_rating ?? 0) },
    { label: t('tourPage.value', 'Giá trị'), value: Number(r.value_rating ?? 0) },
    { label: t('tourPage.accessibility', 'Tiếp cận'), value: Number(r.accessibility_rating ?? 0) },
  ].filter((m) => m.value > 0);

  return (
    <article className="rounded-[14px] border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={BTN_GRADIENT}
        >
          {userName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-foreground text-sm font-semibold">{userName}</span>
              {stars > 0 && (
                <div className="mt-0.5">
                  <StarsDisplay count={stars} size={12} />
                </div>
              )}
            </div>
            {dateStr && (
              <span className="text-muted-foreground shrink-0 text-xs">
                {new Date(dateStr).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>

          {(r.comment || r.body || r.content) && (
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {r.comment || r.body || r.content}
            </p>
          )}

          {subRatings.length > 0 && (
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              {subRatings.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between rounded-[8px] bg-muted px-2.5 py-1.5"
                >
                  <span className="text-muted-foreground text-xs">{m.label}</span>
                  <StarsDisplay count={m.value} size={10} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function TourDetailReviewsSection({
  t,
  reviewId,
  singleReview,
  isLoading,
  reviews,
  starCounts,
  totalReviews,
  pageDisplay,
  pagesDisplay,
  reviewPage,
  onPrevPage,
  onNextPage,
  newRating,
  criteria,
  newComment,
  onCommentChange,
  onCreateReview,
  isSubmitting,
  onResetForm,
}) {
  return (
    <section className="bg-card border-border mb-3 rounded-[16px] border px-5 py-4">
      <h2 className="text-foreground mb-4 text-sm font-bold 2xl:text-base">
        {t('tourPage.reviews', 'Đánh giá')}
      </h2>

      {reviewId && (
        <div className="mb-4 rounded-[10px] border-border bg-primary-soft px-4 py-3">
          <h3 className="text-foreground text-sm font-semibold">
            {t('tourPage.review', 'Đánh giá')} #{singleReview?.id || reviewId}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {singleReview?.comment ||
              singleReview?.content ||
              t('tourPage.reviewNotFound', 'Không tìm thấy đánh giá')}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="mb-4 rounded-[14px] border-border bg-primary-soft p-4">
        <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl leading-none font-black text-primary">
              {totalReviews > 0 && criteria.averageRating > 0
                ? Number(criteria.averageRating).toFixed(1)
                : '—'}
            </div>
            <div className="mt-1.5">
              <StarsDisplay count={Math.round(criteria.averageRating)} size={14} />
            </div>
            <div className="text-muted-foreground mt-1 text-center text-xs">
              {totalReviews} {t('tourPage.reviewsCount', 'đánh giá')}
            </div>
          </div>

          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = Number(starCounts[score] ?? 0);
              const ratio = totalReviews > 0 ? (count / Math.max(1, totalReviews)) * 100 : 0;
              return (
                <div key={score} className="text-muted-foreground flex items-center gap-2 text-xs">
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
              className="h-28 animate-pulse rounded-[14px] border-border bg-muted"
            />
          ))
        ) : reviews.length > 0 ? (
          reviews.map((r) => <TourReviewCard key={r.id} r={r} t={t} />)
        ) : (
          <div className="text-muted-foreground rounded-[14px] border-border bg-muted px-4 py-6 text-center text-sm">
            {t('tourPage.noReviews', 'Chưa có đánh giá nào.')}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagesDisplay > 1 && (
        <div className="mt-3 mb-4 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {t('tourPage.page', 'Trang')} {pageDisplay} / {pagesDisplay}
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost"
              type="button"
              disabled={reviewPage <= 1}
              onClick={onPrevPage}
              className="text-foreground flex h-7 items-center gap-1 rounded-[8px] border-border bg-card px-2.5 text-xs font-semibold hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft size={13} />
              {t('common.prev', 'Trước')}
            </Button>
            <Button variant="ghost"
              type="button"
              disabled={reviewPage >= pagesDisplay}
              onClick={onNextPage}
              className="text-foreground flex h-7 items-center gap-1 rounded-[8px] border-border bg-card px-2.5 text-xs font-semibold hover:bg-muted disabled:opacity-40"
            >
              {t('common.next', 'Sau')}
              <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      )}

      {/* Write review form */}
      <div className="mt-4 rounded-[14px] border-border bg-muted p-4">
        <h3 className="text-foreground mb-4 text-sm font-bold">
          {t('tourPage.leaveReview', 'Viết đánh giá của bạn')}
        </h3>

        {/* Criteria */}
        <div className="mb-4 space-y-2">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
            {t('tourPage.rateCriteria', 'Đánh giá theo tiêu chí')}
          </p>
          {criteria.items.map((criterion) => (
            <div
              key={criterion.key}
              className="flex items-center justify-between rounded-[10px] border-border bg-card px-3 py-2"
            >
              <span className="text-foreground text-sm">{criterion.label}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Button variant="ghost"
                    key={idx}
                    type="button"
                    onClick={() => criterion.setValue(idx + 1)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      size={20}
                      className={
                        idx < criterion.value
                          ? 'fill-[#d99200] text-[#d99200]'
                          : 'fill-[#d99200] text-[#d99200] opacity-20'
                      }
                    />
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Computed average */}
        {newRating > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-[10px] border-border bg-card px-3 py-2">
            <span className="text-muted-foreground text-xs">
              {t('tourPage.avgScore', 'Điểm trung bình')}
            </span>
            <span className="ml-auto text-sm font-black text-primary">{newRating}/5</span>
            <StarsDisplay count={newRating} size={14} />
          </div>
        )}

        {/* Comment */}
        <div className="mb-4">
          <label
            htmlFor="tour-review-comment"
            className="text-muted-foreground mb-1.5 block text-xs font-medium"
          >
            {t('tourPage.comment', 'Nội dung đánh giá')}
          </label>
          <Textarea
            id="tour-review-comment"
            value={newComment}
            maxLength={500}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder={t(
              'tourPage.leave_comment_placeholder',
              'Chia sẻ trải nghiệm, cảm nhận của bạn về tour này...'
            )}
            className="min-h-20 resize-none rounded-[10px] border-border bg-card text-sm focus:border-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost"
            type="button"
            onClick={onResetForm}
            className="text-foreground h-9 rounded-[10px] border-border bg-card px-4 text-sm font-semibold hover:bg-muted"
          >
            {t('tourPage.cancel', 'Huỷ')}
          </Button>
          <Button variant="ghost"
            type="button"
            onClick={onCreateReview}
            disabled={isSubmitting}
            className="h-9 rounded-[10px] px-5 text-sm font-bold text-white hover:text-white disabled:opacity-60"
            style={BTN_GRADIENT}
          >
            {isSubmitting
              ? t('tourPage.sending', 'Đang gửi...')
              : t('tourPage.sendReview', 'Gửi đánh giá')}
          </Button>
        </div>
      </div>
    </section>
  );
}


