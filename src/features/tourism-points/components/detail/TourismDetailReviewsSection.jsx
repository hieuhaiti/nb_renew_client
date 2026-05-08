import React from 'react';
import { Star, Check, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

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
  newVisitDate,
  onVisitDateChange,
  newRecommend,
  onRecommendChange,
  criteria,
  newComment,
  onCommentChange,
  onSelectFiles,
  previews,
  onRemoveFile,
  onReset,
  onSubmit,
  isSubmitting,
}) {
  return (
    <section className="border-border bg-card mb-3 rounded-[10px] border-[0.5px] px-4 py-3.5">
      <h2 className="text-foreground mb-3 text-sm font-medium">
        {t('tourism.reviews', 'Đánh giá')}
      </h2>

      <div className="border-muted grid gap-3 border-b-[0.5px] pb-4 md:grid-cols-[80px_minmax(0,1fr)]">
        <div>
          <div className="typo-kpi text-primary leading-none font-medium">
            {averageDisplayRating > 0 ? averageDisplayRating.toFixed(1) : '-'}
          </div>
          <div className="text-primary mt-1 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={`summary-star-${idx}`}
                className={`h-3 w-3 ${
                  idx < Math.round(averageDisplayRating)
                    ? 'fill-gold text-gold'
                    : 'fill-gold text-gold opacity-30'
                }`}
              />
            ))}
          </div>
          <div className="text-muted-foreground mt-1 text-sm">
            {totalReviewCount} {t('tourism.reviews_count', 'lượt đánh giá')}
          </div>
        </div>

        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = Number(starCounts[score] ?? 0);
            const ratio = totalReviewCount > 0 ? (count / Math.max(1, totalReviewCount)) * 100 : 0;
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
            <article key={r.id} className="border-border bg-card rounded-[8px] border-[0.5px] p-3">
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
                          r.user_name || r.user?.name || r.author || t('tourism.anonymous', 'Khách')
                        }
                      >
                        {r.user_name || r.user?.name || r.author || t('tourism.anonymous', 'Khách')}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, sIdx) => (
                          <Star
                            key={`rv-${r.id}-star-${sIdx}`}
                            className={`h-3 w-3 ${
                              sIdx < computeDisplayRating(r)
                                ? 'fill-gold text-gold'
                                : 'fill-gold text-gold opacity-30'
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
                      t('tourism.no_comment', 'Không có nội dung.')}
                  </p>

                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {[
                      {
                        label: t('tourism.cleanliness', 'Sạch sẽ'),
                        value: Number(r.cleanliness_rating ?? 0),
                      },
                      {
                        label: t('tourism.service', 'Dịch vụ'),
                        value: Number(r.service_rating ?? 0),
                      },
                      {
                        label: t('tourism.value', 'Giá trị'),
                        value: Number(r.value_rating ?? 0),
                      },
                      {
                        label: t('tourism.accessibility', 'Tiếp cận'),
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
                                  ? 'fill-gold text-gold'
                                  : 'fill-gold text-gold opacity-30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {Array.isArray(r.images) && r.images.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 overflow-x-auto">
                      {r.images.map((src, idx) => (
                        <img
                          key={`${r.id}-${idx}`}
                          src={withBaseUrl(src)}
                          alt={`review-${r.id}-${idx}`}
                          className="h-12 w-16 rounded-[6px] object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderImg;
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {r.can_delete && (
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onDeleteReview(r.id)}
                        className="h-6 px-2 text-sm"
                      >
                        {t('tourism.delete', 'Xoá')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-muted-foreground border-border bg-muted rounded-[8px] border-[0.5px] px-3 py-4 text-sm">
            {t('tourism.no_reviews', 'Chưa có đánh giá nào.')}
          </div>
        )}
      </div>

      <div className="mb-1 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {t('tourism.page', 'Trang')} {pageDisplay} / {pagesDisplay}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={reviewPage <= 1}
            onClick={onPrevPage}
            className="h-7 px-2.5 text-sm"
          >
            {t('common.prev', 'Trước')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={reviewPage >= pagesDisplay}
            onClick={onNextPage}
            className="h-7 px-2.5 text-sm"
          >
            {t('common.next', 'Sau')}
          </Button>
        </div>
      </div>

      <div className="border-muted mt-4 border-t-[0.5px] pt-4">
        <h3 className="text-foreground mb-3 text-sm font-medium">
          {t('tourism.write_your_review', 'Viết đánh giá của bạn')}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="visit-date" className="text-muted-foreground mb-1 block text-sm">
              {t('tourism.visit_date', 'Ngày tham quan')}
            </label>
            <Input
              id="visit-date"
              type="date"
              value={newVisitDate}
              onChange={(e) => onVisitDateChange(e.target.value)}
              className="border-border bg-muted h-9 border-[0.5px] text-sm"
            />
          </div>

          <div>
            <label className="text-muted-foreground mb-1 block text-sm">
              {t('tourism.recommend', 'B?n c? ?? xu?t ??a ?i?m n?y?')}
            </label>
            <div className="border-border bg-card inline-flex rounded-[8px] border-[0.5px] p-1">
              <Button
                type="button"
                variant={newRecommend ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRecommendChange(true)}
                className="h-7 rounded-[6px] px-3 text-sm"
              >
                <Check className="h-3 w-3" /> {t('common.yes', 'Có')}
              </Button>
              <Button
                type="button"
                variant={!newRecommend ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRecommendChange(false)}
                className="ml-1 h-7 rounded-[6px] px-3 text-sm"
              >
                <X className="h-3 w-3" /> {t('common.no', 'Không')}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {criteria.map((criterion) => (
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
                    onMouseEnter={() => criterion.setHover(idx + 1)}
                    onMouseLeave={() => criterion.setHover(0)}
                    onClick={() => criterion.setValue(idx + 1)}
                    className="h-5 w-5 p-0"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        idx < (criterion.hover || criterion.value)
                          ? 'fill-gold text-gold'
                          : 'fill-gold text-gold opacity-30'
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <label htmlFor="review-comment" className="text-muted-foreground mb-1 block text-sm">
            {t('tourism.your_comment', 'Cảm nhận của bạn')}
          </label>
          <Textarea
            id="review-comment"
            value={newComment}
            maxLength={500}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder={t(
              'tourism.leave_comment_placeholder',
              'Chia sẻ trải nghiệm, cảm nhận của bạn về địa điểm này...'
            )}
            className="border-border bg-muted h-16 min-h-16 resize-none border-[0.5px] text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="review-file-input" className="text-muted-foreground mb-1 block text-sm">
            {t('tourism.upload_photos', 'Tải ảnh (tối đa 5 ảnh)')}
          </label>

          <div
            className="text-muted-foreground border-border hover:bg-muted flex h-13 cursor-pointer items-center justify-center gap-2 rounded-[8px] border-[0.5px] border-dashed text-sm transition"
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
            <Plus className="text-primary h-3.5 w-3.5" />
            {t('tourism.upload_hint', 'Nhấn để chọn ảnh hoặc kéo thả vào đây')}
            <Input
              id="review-file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={onSelectFiles}
              className="hidden"
            />
          </div>

          {previews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {previews.map((u, i) => (
                <div key={`preview-${i}`} className="group relative overflow-hidden rounded-[7px]">
                  <img src={u} alt={`preview-${i}`} className="h-14 w-full object-cover" />
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => onRemoveFile(i)}
                    className="bg-card/90 absolute top-1 right-1 h-5 w-5 rounded-full p-0 text-sm opacity-0 group-hover:opacity-100"
                  >
                    x
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onReset} className="h-8 rounded-[7px] px-3 text-sm">
            {t('tourism.cancel', 'Huỷ')}
          </Button>
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-8 rounded-[7px] px-3 text-sm disabled:opacity-70"
          >
            {isSubmitting ? t('tourism.sending', 'Äang gửi...') : t('tourism.submit_review', 'Gửi')}
          </Button>
        </div>
      </div>
    </section>
  );
}
