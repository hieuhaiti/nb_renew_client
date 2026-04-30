import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
    <section className="bg-card mb-3 rounded-[10px] border-[0.5px] border-nature-border px-4 py-3.5">
      <h2 className="text-foreground mb-3 text-sm font-medium">
        {t('tourPage.reviews', 'Đánh giá')}
      </h2>

      {reviewId && (
        <div className="mb-3 rounded-[8px] border-[0.5px] border-nature-border bg-nature-soft px-3 py-2">
          <h3 className="text-foreground text-xs font-medium">
            {t('tourPage.review', 'Đánh giá')} #{singleReview?.id || reviewId}
          </h3>
          {singleReview ? (
            <div className="text-muted-foreground mt-1 text-xs">
              {singleReview.comment || t('tourPage.noComment', 'Không có nội dung')}
            </div>
          ) : (
            <div className="text-muted-foreground mt-1 text-xs">
              {t('tourPage.reviewNotFound', 'Không tìm thấy đánh giá')}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-3 border-b-[0.5px] border-nature-soft pb-4 md:grid-cols-[80px_minmax(0,1fr)]">
        <div>
          <div className="typo-kpi leading-none font-medium text-nature">
            {totalReviews ? Number(totalReviews > 0 ? criteria.averageRating : 0).toFixed(1) : '-'}
          </div>
          <div className="mt-1 flex items-center gap-0.5 text-nature">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={`summary-star-${idx}`}
                className={`h-3 w-3 ${
                  idx < Math.round(criteria.averageRating) ? 'text-nature' : 'text-nature-label'
                }`}
              />
            ))}
          </div>
          <div className="mt-1 text-xs text-nature-label">
            {totalReviews} {t('tourPage.reviewsCount', 'lượt đánh giá')}
          </div>
        </div>

        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = Number(starCounts[score] ?? 0);
            const ratio = totalReviews > 0 ? (count / Math.max(1, totalReviews)) * 100 : 0;
            return (
              <div
                key={`bar-${score}`}
                className="text-muted-foreground flex items-center gap-2 text-xs"
              >
                <span className="w-4 text-right">{score}</span>
                <div className="h-1.25 flex-1 overflow-hidden rounded-[3px] bg-nature-soft">
                  <div className="h-full bg-nature" style={{ width: `${ratio}%` }} />
                </div>
                <span className="w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-h-90 space-y-3 overflow-y-auto py-3 pr-1">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`review-loading-${i}`}
              className="h-27.5 animate-pulse rounded-[8px] border-[0.5px] border-nature-border bg-nature-soft"
            />
          ))
        ) : reviews.length > 0 ? (
          reviews.map((r) => (
            <article
              key={r.id}
              className="bg-card rounded-[8px] border-[0.5px] border-nature-border p-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nature-foreground text-xs font-medium text-nature-dark">
                  {((r.user_name || r.user?.name || r.author || 'K') + '').charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="text-foreground truncate text-xs font-medium"
                        title={
                          r.user_name || r.user?.name || r.author || t('tourPage.guest', 'Khách')
                        }
                      >
                        {r.user_name || r.user?.name || r.author || t('tourPage.guest', 'Khách')}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, sIdx) => (
                          <Star
                            key={`rv-${r.id}-star-${sIdx}`}
                            className={`h-3 w-3 ${
                              sIdx < Number(r.rating || 0) ? 'text-nature' : 'text-nature-label'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-nature-label">
                      {new Date(r.created_at || r.createdAt || r.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-nature-muted-foreground">
                    {r.comment ||
                      r.body ||
                      r.content ||
                      t('tourPage.noComment', 'Không có nội dung.')}
                  </p>

                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {[
                      {
                        label: t('tourPage.cleanliness', 'Sạch sẽ'),
                        value: Number(r.cleanliness_rating ?? 0),
                      },
                      {
                        label: t('tourPage.service', 'Dịch vụ'),
                        value: Number(r.service_rating ?? 0),
                      },
                      {
                        label: t('tourPage.value', 'Giá trị'),
                        value: Number(r.value_rating ?? 0),
                      },
                      {
                        label: t('tourPage.accessibility', 'Tiếp cận'),
                        value: Number(r.accessibility_rating ?? 0),
                      },
                    ].map((metric) => (
                      <div
                        key={`${r.id}-${metric.label}`}
                        className="flex items-center justify-between rounded-[6px] bg-nature-soft px-2 py-1"
                      >
                        <span className="text-muted-foreground text-xs">{metric.label}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, miniIdx) => (
                            <Star
                              key={`${r.id}-${metric.label}-${miniIdx}`}
                              className={`h-2.5 w-2.5 ${
                                miniIdx < metric.value ? 'text-nature' : 'text-nature-label'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-muted-foreground rounded-[8px] border-[0.5px] border-nature-border bg-nature-soft px-3 py-4 text-xs">
            {t('tourPage.noReviews', 'Chưa có đánh giá nào.')}
          </div>
        )}
      </div>

      <div className="mb-1 flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {t('tourPage.page', 'Trang')} {pageDisplay} / {pagesDisplay}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={reviewPage <= 1}
            onClick={onPrevPage}
            className="bg-card h-7 border-[0.5px] border-nature-border px-2.5 text-xs hover:bg-nature-soft"
          >
            {t('common.prev', 'Trước')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={reviewPage >= pagesDisplay}
            onClick={onNextPage}
            className="bg-card h-7 border-[0.5px] border-nature-border px-2.5 text-xs hover:bg-nature-soft"
          >
            {t('common.next', 'Sau')}
          </Button>
        </div>
      </div>

      <div className="mt-4 border-t-[0.5px] border-nature-soft pt-4">
        <h3 className="text-foreground mb-3 text-xs font-medium">
          {t('tourPage.leaveReview', 'Viết đánh giá của bạn')}
        </h3>

        <div className="mb-3">
          <div className="text-muted-foreground mb-1 block text-xs">
            {t('tourPage.starCount', '?i?m sao t?ng (t? t?nh)')}
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={`new-rating-${i}`}
                className={`h-3.5 w-3.5 ${i + 1 <= newRating ? 'text-nature' : 'text-nature-label'}`}
              />
            ))}
            <span className="text-muted-foreground text-xs">
              {newRating ? `${newRating}/5` : t('tourPage.noRating', 'Chưa có đánh giá')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {criteria.items.map((criterion) => (
            <div
              key={criterion.key}
              className="flex items-center justify-between rounded-[6px] bg-nature-soft px-2 py-1.5"
            >
              <span className="text-muted-foreground text-xs">{criterion.label}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Button
                    key={`${criterion.key}-${idx}`}
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => criterion.setValue(idx + 1)}
                    className="h-5 w-5 p-0 hover:bg-transparent"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        idx < criterion.value ? 'text-nature' : 'text-nature-label'
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <label
            htmlFor="tour-review-comment"
            className="text-muted-foreground mb-1 block text-xs"
          >
            {t('tourPage.comment', 'Cảm nhận của bạn')}
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
            className="h-16 min-h-16 resize-none border-[0.5px] border-nature-border bg-nature-soft text-xs"
          />
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onResetForm}
            className="h-8 rounded-[7px] border-[0.5px] border-nature-border px-3 text-xs hover:bg-nature-soft"
          >
            {t('tourPage.cancel', 'Huỷ')}
          </Button>
          <Button
            onClick={onCreateReview}
            disabled={isSubmitting}
            className="text-primary-foreground h-8 rounded-[7px] bg-nature px-3 text-xs hover:bg-nature-hover disabled:opacity-70"
          >
            {isSubmitting ? t('tourPage.sending', 'Äang gửi...') : t('tourPage.sendReview', 'Gửi')}
          </Button>
        </div>
      </div>
    </section>
  );
}
