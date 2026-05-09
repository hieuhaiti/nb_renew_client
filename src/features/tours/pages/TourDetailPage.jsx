import React from 'react';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { TourDetailTopBar } from '@/features/tours/components/TourDetailTopBar';
import { TourDetailHero } from '@/features/tours/components/TourDetailHero';
import { TourDetailQuickStats } from '@/features/tours/components/TourDetailQuickStats';
import { TourDetailIntroSection } from '@/features/tours/components/TourDetailIntroSection';
import { TourDetailStopsSection } from '@/features/tours/components/TourDetailStopsSection';
import { TourDetailReviewsSection } from '@/features/tours/components/TourDetailReviewsSection';
import { TourDetailSidebar } from '@/features/tours/components/TourDetailSidebar';
import { useTourDetailPageModel } from '@/features/tours/hooks/useTourDetailPageModel';
import ModalCarousel from '@/features/map/components/ModalCarousel';

export default function TourDetailPage() {
  const { t } = useTranslation();
  const {
    navigate,
    isLoading,
    isError,
    tour,
    tourName,
    isLiked,
    toggleFavorite,
    shareStatus,
    shareLink,
    safeImagesMapped,
    currentImageIndex,
    subtitle,
    heroTags,
    quickStats,
    plainDescription,
    reviewId,
    singleReview,
    reviewsQuery,
    safeReviewItems,
    starCounts,
    totalReviewCount,
    pageDisplay,
    pagesDisplay,
    reviewPage,
    setReviewPage,
    newRating,
    averageDisplayRating,
    cleanlinessRating,
    setCleanlinessRating,
    serviceRating,
    setServiceRating,
    valueRating,
    setValueRating,
    accessibilityRating,
    setAccessibilityRating,
    newComment,
    setNewComment,
    handleCreateReview,
    createReviewMut,
    handleResetReviewForm,
    ticketDisplay,
    sidebarRows,
    tourStops,
    handleOpenMap,
    handleContact,
  } = useTourDetailPageModel(t);

  if (isLoading) {
    return (
      <RootLayout>
        <div className="bg-background min-h-screen">
          <LoadingOverlay />
        </div>
      </RootLayout>
    );
  }

  if (isError || !tour) {
    return (
      <RootLayout>
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-foreground mb-4 text-2xl font-bold">
              {t('tourPage.notFound', 'Không tìm thấy thông tin tour.')}
            </h2>
            <Button
              onClick={() => navigate('/tour')}
              className="bg-primary text-primary-foreground hover:bg-(--primary-hover)"
            >
              {t('tourPage.back', 'Quay lại')}
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="bg-background min-h-screen pb-8">
        <div className="mx-auto max-w-7xl px-3 py-4 md:px-4">
          <TourDetailTopBar
            onBack={() => navigate('/tour')}
            isLiked={isLiked}
            onToggleFavorite={toggleFavorite}
            onShare={shareLink}
            shareStatus={shareStatus}
            t={t}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <main className="space-y-3">
              <TourDetailHero
                imageSrc={safeImagesMapped[currentImageIndex]}
                title={tourName || t('tourPage.unknown', 'Tour')}
                subtitle={subtitle}
                tags={heroTags}
                totalImages={safeImagesMapped.length}
                t={t}
              />

              <TourDetailQuickStats stats={quickStats} />

              <TourDetailIntroSection
                description={plainDescription}
                includes={tour?.includes}
                excludes={tour?.excludes}
                t={t}
              />

              <TourDetailStopsSection stops={tourStops} t={t} />

              <TourDetailReviewsSection
                t={t}
                reviewId={reviewId}
                singleReview={singleReview}
                isLoading={reviewsQuery.isLoading}
                reviews={safeReviewItems}
                starCounts={starCounts}
                totalReviews={totalReviewCount}
                pageDisplay={pageDisplay}
                pagesDisplay={pagesDisplay}
                reviewPage={reviewPage}
                onPrevPage={() => setReviewPage((p) => Math.max(1, p - 1))}
                onNextPage={() => setReviewPage((p) => p + 1)}
                newRating={newRating}
                criteria={{
                  averageRating: averageDisplayRating,
                  items: [
                    {
                      key: 'cleanliness',
                      label: t('tourPage.cleanliness', 'Sạch sẽ'),
                      value: cleanlinessRating,
                      setValue: setCleanlinessRating,
                    },
                    {
                      key: 'service',
                      label: t('tourPage.service', 'Dịch vụ'),
                      value: serviceRating,
                      setValue: setServiceRating,
                    },
                    {
                      key: 'value',
                      label: t('tourPage.value', 'Giá trị'),
                      value: valueRating,
                      setValue: setValueRating,
                    },
                    {
                      key: 'accessibility',
                      label: t('tourPage.accessibility', 'Tiếp cận'),
                      value: accessibilityRating,
                      setValue: setAccessibilityRating,
                    },
                  ],
                }}
                newComment={newComment}
                onCommentChange={setNewComment}
                onCreateReview={handleCreateReview}
                isSubmitting={createReviewMut.isPending}
                onResetForm={handleResetReviewForm}
              />
            </main>

            <TourDetailSidebar
              ticketDisplay={ticketDisplay}
              subtitle={t('tourPage.priceSub', 'Thông tin giá từ nhà cung cấp tour')}
              onOpenMap={handleOpenMap}
              onContact={handleContact}
              rows={sidebarRows}
              t={t}
            />
          </div>
        </div>
      </div>
      <ModalCarousel />
    </RootLayout>
  );
}
