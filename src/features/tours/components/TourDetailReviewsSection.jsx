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
    <section className="bg-card border-border mb-3 rounded-[10px] border-[0.5px] px-4 py-3.5">
      <h2 className="text-foreground mb-3 text-sm font-medium">
        {t('tourPage.reviews', 'Đánh giá')}
      </h2>

      {reviewId && (
        <div className="border-border bg-muted mb-3 rounded-[8px] border-[0.5px] px-3 py-2">
          <h3 className="text-foreground text-sm font-medium">
            {t('tourPage.review', 'Đánh giá')} #{singleReview?.id || reviewId}
          </h3>
          {singleReview ? (
            <div className="text-muted-foreground mt-1 text-sm">
              {singleReview.comment || t('tourPage.noComment', 'Không có nội dung')}
            </div>
          ) : (
            <div className="text-muted-foreground mt-1 text-sm">
              {t('tourPage.reviewNotFound', 'Không tìm thấy đánh giá')}
            </div>
          )}
        </div>
      )}

      <div className="border-muted grid gap-3 border-b-[0.5px] pb-4 md:grid-cols-[80px_minmax(0,1fr)]">
        <div>
          <div className="typo-kpi text-primary leading-none font-medium">
            {totalReviews ? Number(totalReviews > 0 ? criteria.averageRating : 0).toFixed(1) : '-'}
          </div>
          <div className="text-primary mt-1 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={`summary-star-${idx}`}
                className={`h-3 w-3 ${
                  idx < Math.round(criteria.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-yellow-400 text-yellow-400 opacity-30'
                }`}
              />
            ))}
          </div>
          <div className="text-muted-foreground mt-1 text-sm">
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
                className="text-muted-foreground flex items-center gap-2 text-sm"
              >
                <span className="w-4 text-right">{score}</span>
                <div className="bg-muted h-1.25 flex-1 overflow-hidden rounded-[3px]">
                  <div className="bg-primary h-full" style={{ width: `${ratio}%` }} />
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
              className="border-border bg-muted h-27.5 animate-pulse rounded-[8px] border-[0.5px]"
            />
          ))
        ) : reviews.length > 0 ? (
          reviews.map((r) => (
            <article key={r.id} className="bg-card border-border rounded-[8px] border-[0.5px] p-3">
              <div className="flex items-start gap-2.5">
                <div className="bg-primary-foreground text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                  {((r.user_name || r.user?.name || r.author || 'K') + '').charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="text-foreground truncate text-sm font-medium"
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
                              sIdx < Number(r.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-yellow-400 text-yellow-400 opacity-30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {new Date(r.created_at || r.createdAt || r.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-1 text-sm">
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
                        className="bg-muted flex items-center justify-between rounded-[6px] px-2 py-1"
                      >
                        <span className="text-muted-foreground text-sm">{metric.label}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, miniIdx) => (
                            <Star
                              key={`${r.id}-${metric.label}-${miniIdx}`}
                              className={`h-2.5 w-2.5 ${
                                miniIdx < metric.value
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-yellow-400 text-yellow-400 opacity-30'
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
          <div className="text-muted-foreground border-border bg-muted rounded-[8px] border-[0.5px] px-3 py-4 text-sm">
            {t('tourPage.noReviews', 'Chưa có đánh giá nào.')}
          </div>
        )}
      </div>

      <div className="mb-1 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {t('tourPage.page', 'Trang')} {pageDisplay} / {pagesDisplay}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={reviewPage <= 1}
            onClick={onPrevPage}
            className="bg-card border-border hover:bg-muted h-7 border-[0.5px] px-2.5 text-sm"
          >
            {t('common.prev', 'Trước')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={reviewPage >= pagesDisplay}
            onClick={onNextPage}
            className="bg-card border-border hover:bg-muted h-7 border-[0.5px] px-2.5 text-sm"
          >
            {t('common.next', 'Sau')}
          </Button>
        </div>
      </div>

      <div className="border-muted mt-4 border-t-[0.5px] pt-4">
        <h3 className="text-foreground mb-3 text-sm font-medium">
          {t('tourPage.leaveReview', 'Viết đánh giá của bạn')}
        </h3>

        <div className="mb-3">
          <div className="text-muted-foreground mb-1 block text-sm">
            {t('tourPage.starCount', 'Điểm sao tổng (tự tính)')}
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={`new-rating-${i}`}
                className={`h-3.5 w-3.5 ${
                  i + 1 <= newRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-yellow-400 text-yellow-400 opacity-30'
                }`}
              />
            ))}
            <span className="text-muted-foreground text-sm">
              {newRating ? `${newRating}/5` : t('tourPage.noRating', 'Chưa có đánh giá')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {criteria.items.map((criterion) => (
            <div
              key={criterion.key}
              className="bg-muted flex items-center justify-between rounded-[6px] px-2 py-1.5"
            >
              <span className="text-muted-foreground text-sm">{criterion.label}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Button
                    key={`${criterion.key}-${idx}`}
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => criterion.setValue(idx + 1)}
                    className="h-5 w-5 p-0"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        idx < criterion.value
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-yellow-400 text-yellow-400 opacity-30'
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <label htmlFor="tour-review-comment" className="text-muted-foreground mb-1 block text-sm">
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
            className="border-border bg-muted h-16 min-h-16 resize-none border-[0.5px] text-sm"
          />
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={onResetForm}
            className="h-8 rounded-[7px] px-3 text-sm"
          >
            {t('tourPage.cancel', 'Huỷ')}
          </Button>
          <Button
            variant="default"
            onClick={onCreateReview}
            disabled={isSubmitting}
            className="h-8 rounded-[7px] px-3 text-sm disabled:opacity-70"
          >
            {isSubmitting ? t('tourPage.sending', 'Đang gửi...') : t('tourPage.sendReview', 'Gửi')}
          </Button>
        </div>
      </div>
    </section>
  );
}
