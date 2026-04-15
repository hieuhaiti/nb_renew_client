import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Clock3, MapPin, CalendarDays, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RootLayout from '@/components/layout/RootLayout';
import { useGetDataPointById } from '@/features/tourism-points/api/tourismPointsApi';
import { formatVND, withBaseUrl } from '@/lib/utils';
import {
  useGetTourismReviewByTourismPointId,
  useCreateTourismReview,
  useReviewStats,
} from '@/features/tourism-points/api/tourismPointsReviewApi';
import { mutater } from '@/services/mutater';
// TODO: map states removed for now
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import placeholderImg from '@/assets/images/placeholder.png';
import { TourismDetailTopBar } from '@/features/tourism-points/components/detail/TourismDetailTopBar';
import { TourismDetailHero } from '@/features/tourism-points/components/detail/TourismDetailHero';
import { TourismDetailQuickStats } from '@/features/tourism-points/components/detail/TourismDetailQuickStats';
import { TourismDetailGallerySection } from '@/features/tourism-points/components/detail/TourismDetailGallerySection';
import { TourismDetailIntroSection } from '@/features/tourism-points/components/detail/TourismDetailIntroSection';
import { TourismDetailReviewsSection } from '@/features/tourism-points/components/detail/TourismDetailReviewsSection';
import { TourismDetailSidebar } from '@/features/tourism-points/components/detail/TourismDetailSidebar';

const getDefaultVisitDate = () =>
  new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

const stripHtmlTags = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function TourismDetailPage() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [shareStatus, setShareStatus] = useState('idle'); // 'idle' | 'copied' | 'shared'
  // const { resetLayers } = useDataLayerStore();
  // const { setCategoryID } = useCategoriesStore();

  // Fetch point detail from API using provided service hook
  const {
    data: pointResp,
    isError,
    isLoading,
  } = useGetDataPointById({
    point_id: id,
    format: 'json',
  });
  const attraction = useMemo(() => {
    if (!pointResp) return null;
    // common shapes: pointResp.data.point OR pointResp.data OR pointResp.point
    return pointResp.data?.point || pointResp.data || pointResp.point || null;
  }, [pointResp]);

  // Compute images safely and keep them memoized so hooks below are stable
  const images = useMemo(() => {
    if (!attraction) return [];
    return (
      (Array.isArray(attraction.gallery_images) && attraction.gallery_images?.length > 0
        ? attraction.gallery_images
        : null) ||
      (Array.isArray(attraction.images) && attraction.images?.length > 0
        ? attraction.images
        : null) ||
      (attraction.main_image_url ? [attraction.main_image_url] : null) ||
      (attraction.featured_image ? [attraction.featured_image] : null) ||
      []
    );
  }, [attraction]);

  const placeholderImage = placeholderImg;
  const safeImages = useMemo(
    () => (Array.isArray(images) && images.length > 0 ? images : [placeholderImage]),
    [images]
  );

  // Map images through withBaseUrl so every src is a normalized absolute URL
  const safeImagesMapped = useMemo(() => safeImages.map((s) => withBaseUrl(s)), [safeImages]);

  // Keep currentImageIndex within bounds when images change
  useEffect(() => {
    if (currentImageIndex >= safeImages.length) {
      setCurrentImageIndex(0);
    }
  }, [safeImages, currentImageIndex]);

  // Favorites: persist liked point ids in localStorage under key 'favorites'
  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites');
      const favs = raw ? JSON.parse(raw) : [];
      setIsLiked(Boolean(favs && Array.isArray(favs) && favs.includes(String(id))));
    } catch {
      // ignore malformed localStorage
      setIsLiked(false);
    }
  }, [id]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('favorites');
      const favs = raw && Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const idStr = String(id);
      const exists = favs.includes(idStr);
      const newFavs = exists ? favs.filter((x) => x !== idStr) : [...favs, idStr];
      localStorage.setItem('favorites', JSON.stringify(newFavs));
      setIsLiked(!exists);
    } catch {
      // ignore
    }
  };

  const shareLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: attraction?.name || t('tourism.detail_title', 'Tourism point'),
          url,
        });
        setShareStatus('shared');
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setShareStatus('copied');
      } else {
        // fallback
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShareStatus('copied');
      }
      // reset status after 2s
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch {
      setShareStatus('idle');
    }
  };

  // Reviews hooks/state must be initialized unconditionally (before early returns)
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLimit] = useState(10);
  const reviewsQuery = useGetTourismReviewByTourismPointId({
    page: reviewPage,
    limit: reviewLimit,
    tourismPointId: attraction?.id,
  });
  const statsId = attraction?.id || attraction?.point_id || attraction?._id || null;
  const reviewStats = useReviewStats(statsId);
  const createReviewMut = useCreateTourismReview({
    onSuccess: () => {
      // refetch list and stats after success
      reviewsQuery.refetch();
      reviewStats.refetch();
    },
  });

  const [newCleanliness, setNewCleanliness] = useState(0);
  const [newService, setNewService] = useState(0);
  const [newValue, setNewValue] = useState(0);
  const [newAccessibility, setNewAccessibility] = useState(0);
  const [hoverCleanliness, setHoverCleanliness] = useState(0);
  const [hoverService, setHoverService] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [hoverAccessibility, setHoverAccessibility] = useState(0);

  const [newComment, setNewComment] = useState('');

  const [newVisitDate, setNewVisitDate] = useState(getDefaultVisitDate());
  const [newRecommend, setNewRecommend] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    setReviewPage(1);
  }, [attraction?.id]);

  useEffect(() => {
    // build previews
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = Array.from(selectedFiles).map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [selectedFiles]);

  const handleFilesChange = (e) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedFiles(Array.from(files));
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateReview = async () => {
    if (!attraction?.id) return;

    if (
      Number(newCleanliness) === 0 ||
      Number(newService) === 0 ||
      Number(newValue) === 0 ||
      Number(newAccessibility) === 0
    ) {
      toast.error(t('tourism.review.missing_rating', 'Please provide ratings.'));
      return;
    }

    const overall = Math.round(
      (Number(newCleanliness) + Number(newService) + Number(newValue) + Number(newAccessibility)) /
        4
    );

    // Build JSON payload expected by backend Joi schema
    const payload = {
      tourism_point_id: Number(attraction.id),
      rating: Number(overall),
      title: '',
      comment: newComment || '',
      cleanliness_rating: Number(newCleanliness) || null,
      service_rating: Number(newService) || null,
      value_rating: Number(newValue) || null,
      accessibility_rating: Number(newAccessibility) || null,
      images: [],
      visit_date: newVisitDate ? new Date(newVisitDate).toISOString() : null,
      visit_season: newVisitDate
        ? (function () {
            const month = new Date(newVisitDate).getMonth() + 1;
            if ([3, 4, 5].includes(month)) return 'spring';
            if ([6, 7, 8].includes(month)) return 'summer';
            if ([9, 10, 11].includes(month)) return 'autumn';
            return 'winter';
          })()
        : null,
      recommend: Boolean(newRecommend),
    };

    // If there are files, submit as multipart/form-data with files attached.
    // If there are no files, send a JSON payload (matches sample shape with images: []).
    if (selectedFiles && selectedFiles.length > 0) {
      const fd = new FormData();
      fd.append('tourism_point_id', String(payload.tourism_point_id));
      fd.append('rating', String(payload.rating));
      fd.append('title', payload.title || '');
      fd.append('comment', payload.comment || '');
      if (payload.cleanliness_rating !== null)
        fd.append('cleanliness_rating', String(payload.cleanliness_rating));
      if (payload.service_rating !== null)
        fd.append('service_rating', String(payload.service_rating));
      if (payload.value_rating !== null) fd.append('value_rating', String(payload.value_rating));
      if (payload.accessibility_rating !== null)
        fd.append('accessibility_rating', String(payload.accessibility_rating));
      if (payload.visit_date) fd.append('visit_date', payload.visit_date);
      if (payload.visit_season) fd.append('visit_season', payload.visit_season);
      fd.append('recommend', payload.recommend ? 'true' : 'false');

      selectedFiles.forEach((f) => fd.append('images', f));
      createReviewMut.mutate(fd);
    } else {
      // No files: send JSON matching the shape you provided (images: [])
      createReviewMut.mutate(payload);
    }

    setNewComment('');
    setNewCleanliness(0);
    setNewService(0);
    setNewValue(0);
    setNewAccessibility(0);
    setNewRecommend(true);
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleResetReviewForm = () => {
    setNewComment('');
    setNewCleanliness(0);
    setNewService(0);
    setNewValue(0);
    setNewAccessibility(0);
    setNewVisitDate(getDefaultVisitDate());
    setNewRecommend(true);
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await mutater(`tourism-reviews/${reviewId}`, 'DELETE');
      reviewsQuery.refetch();
    } catch {
      // ignore
    }
  };

  const handleOpenMap = async () => {
    const cachedVi = queryClient.getQueryData(['categories', 'vi']);
    const cachedEn = queryClient.getQueryData(['categories', 'en']);
    const categories = cachedVi?.data?.categories || cachedEn?.data?.categories || [];
    const category = categories.find((c) => c.id === attraction.category_id);
    const slug = category ? category.slug : null;
    if (category && slug) {
      navigate(`/${slug}`, {
        state: {
          attractionId: attraction.id,
          mode: 'direction',
        },
      });
      return;
    }
    navigate('/map');
  };

  const handleContact = () => {
    const phone = attraction?.contact_phone || attraction?.phone || attraction?.contact?.phone;
    if (!phone) {
      toast.info(t('tourism.contact_not_available', 'Chưa có thông tin liên hệ.'));
      return;
    }
    window.location.href = `tel:${String(phone).trim()}`;
  };

  if (isLoading) {
    return (
      <RootLayout>
        <div className="bg-background min-h-screen">
          <LoadingOverlay />
        </div>
      </RootLayout>
    );
  }
  if (!attraction || isError) {
    return (
      <RootLayout>
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-foreground mb-4 text-2xl font-bold">
              {t('tourism.not_found', 'Tourism point not found')}
            </h2>
            <Button
              onClick={() => navigate('/tourism-point')}
              className="bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-(--primary-hover)"
            >
              {t('tourism.back_to_list', 'Back to list')}
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  // Compute a display rating for a review as the rounded average of the 4 detailed criteria
  const computeDisplayRating = (r) => {
    if (!r) return 0;
    const nums = [r.cleanliness_rating, r.service_rating, r.value_rating, r.accessibility_rating]
      .map((x) => (x === undefined || x === null ? NaN : Number(x)))
      .filter((n) => !Number.isNaN(n));
    if (nums.length === 0) return Math.round(Number(r.rating) || 0);
    const sum = nums.reduce((a, b) => a + b, 0);
    return Math.round(sum / nums.length);
  };

  /* Two-column detail layout */
  const avgRatingValue = attraction.average_rating ? Number(attraction.average_rating) : null;
  const totalReviewsValue = attraction.total_reviews ? Number(attraction.total_reviews) : 0;

  // Pagination display: use server-provided pagination when available,
  // otherwise fall back to sensible defaults (page 1 / pages 1).
  const serverPagination =
    reviewsQuery?.data?.data?.pagination || reviewsQuery?.data?.pagination || null;
  const pageDisplay = serverPagination?.page ?? reviewPage ?? 1;
  const pagesDisplay = serverPagination?.pages ?? serverPagination?.total_pages ?? 1;

  const reviewItems =
    reviewsQuery?.data?.data?.reviews ||
    reviewsQuery?.data?.data?.items ||
    reviewsQuery?.data?.data ||
    [];
  const safeReviewItems = Array.isArray(reviewItems) ? reviewItems : [];

  const derivedStarCounts = safeReviewItems.reduce(
    (acc, item) => {
      const rating = Math.min(5, Math.max(1, computeDisplayRating(item)));
      if (rating >= 1 && rating <= 5) {
        acc[rating] += 1;
      }
      acc.total += 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: 0 }
  );

  const statsData = reviewStats?.data?.data || reviewStats?.data || {};
  const statsCounts = {
    5: Number(statsData?.five_star ?? 0),
    4: Number(statsData?.four_star ?? 0),
    3: Number(statsData?.three_star ?? 0),
    2: Number(statsData?.two_star ?? 0),
    1: Number(statsData?.one_star ?? 0),
  };
  const hasServerStats = Object.values(statsCounts).some((n) => Number(n) > 0);
  const starCounts = hasServerStats
    ? statsCounts
    : {
        5: derivedStarCounts[5],
        4: derivedStarCounts[4],
        3: derivedStarCounts[3],
        2: derivedStarCounts[2],
        1: derivedStarCounts[1],
      };

  const totalReviewCount =
    Number(statsData?.total_reviews ?? attraction.total_reviews ?? derivedStarCounts.total) || 0;

  const avgReviewFromStats = Number(
    statsData?.average_rating ?? statsData?.avg_rating ?? attraction.average_rating
  );
  const averageDisplayRating =
    Number.isFinite(avgReviewFromStats) && avgReviewFromStats > 0 ? avgReviewFromStats : 0;

  const openingHours =
    attraction?.opening_hours?.default ||
    attraction?.opening_hours ||
    attraction?.business_hours ||
    t('tourism.unknown', 'Chưa cập nhật');

  const entranceFeeRaw =
    attraction?.entrance_fee ?? attraction?.ticket_price ?? attraction?.price ?? 0;
  const entranceFeeNumber = Number(entranceFeeRaw);
  const ticketDisplay =
    Number.isFinite(entranceFeeNumber) && entranceFeeNumber > 0
      ? formatVND(entranceFeeNumber)
      : t('tourism.free', 'Miễn phí');

  const crowdStatus =
    attraction?.crowd_status || attraction?.crowd_level || t('tourism.peak_status', 'Cao điểm');
  const isHighCrowd = /cao|peak|high/i.test(String(crowdStatus));

  const distanceValue =
    attraction?.distance_text ??
    attraction?.distance_km ??
    attraction?.distance ??
    attraction?.distanceKm;
  const distanceText =
    typeof distanceValue === 'number'
      ? `${distanceValue.toFixed(1)} km`
      : typeof distanceValue === 'string' && distanceValue.trim()
        ? distanceValue
        : '';

  const heroTags = (() => {
    const extracted = [
      attraction?.category_name,
      attraction?.classification,
      attraction?.type,
      attraction?.theme,
      ...(Array.isArray(attraction?.tags) ? attraction.tags : []),
      ...(Array.isArray(attraction?.categories)
        ? attraction.categories
            .map((item) => (typeof item === 'string' ? item : item?.name))
            .filter(Boolean)
        : []),
    ]
      .filter(Boolean)
      .map((item) => String(item).trim());

    const unique = [...new Set(extracted)];
    if (unique.length > 0) return unique.slice(0, 2);
    return [
      t('tourism.default_tag_national', 'Di tích quốc gia'),
      t('tourism.default_tag_spiritual', 'Tâm linh'),
    ];
  })();

  const introTags = (() => {
    const extra = [
      ...heroTags,
      attraction?.visit_type,
      attraction?.best_time,
      attraction?.suitable_for,
      attraction?.highlight,
    ]
      .filter(Boolean)
      .map((item) => String(item).trim());
    const unique = [...new Set(extra)];
    return unique.slice(0, 6);
  })();

  const galleryPreviewImages = (() => {
    if (!safeImagesMapped.length) return [];
    const picked = safeImagesMapped.slice(0, 5);
    if (picked.length === 5) return picked;
    const filled = [...picked];
    while (filled.length < 5) {
      filled.push(safeImagesMapped[filled.length % safeImagesMapped.length]);
    }
    return filled;
  })();

  const plainDescription = stripHtmlTags(attraction?.description);

  const nearbyPoints = (() => {
    const source = Array.isArray(attraction?.nearby_points)
      ? attraction.nearby_points
      : Array.isArray(attraction?.nearby)
        ? attraction.nearby
        : [];

    if (source.length > 0) {
      return source.slice(0, 4).map((item, index) => ({
        id: item?.id || `nearby-${index}`,
        name: item?.name || t('tourism.nearby_point_name', `Điểm ${index + 1}`),
        distance:
          item?.distance_text ||
          (typeof item?.distance_km === 'number' ? `${item.distance_km.toFixed(1)} km` : null) ||
          item?.distance ||
          t('tourism.nearby_distance_unknown', 'Chưa rõ khoảng cách'),
        image: withBaseUrl(
          item?.main_image_url || item?.image || safeImagesMapped[index % safeImagesMapped.length]
        ),
      }));
    }

    return galleryPreviewImages.slice(0, 4).map((image, index) => ({
      id: `placeholder-nearby-${index}`,
      name: t('tourism.nearby_point_name', `Điểm ${index + 1}`),
      distance: `${(index + 1) * 0.7} km`,
      image,
    }));
  })();

  const sidebarRows = [
    {
      key: 'location',
      label: t('tourism.location', 'Vị trí'),
      value: attraction?.address || t('tourism.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-[#2e6f40]',
      icon: <MapPin className="text-primary h-3.5 w-3.5" />,
    },
    {
      key: 'hours',
      label: t('tourism.opening_hours', 'Giờ mở'),
      value: openingHours,
      dotClass: 'bg-[#2e6f40]',
      icon: <Clock3 className="text-primary h-3.5 w-3.5" />,
    },
    {
      key: 'season',
      label: t('tourism.season', 'Mùa phù hợp'),
      value:
        attraction?.best_season || attraction?.visit_season || t('tourism.all_year', 'Quanh năm'),
      dotClass: 'bg-[#ba7517]',
      icon: <CalendarDays className="h-3.5 w-3.5 text-[#ba7517]" />,
    },
    {
      key: 'type',
      label: t('tourism.type', 'Loại hình'),
      value: heroTags[0] || t('tourism.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-[#f87171]',
      icon: <Leaf className="h-3.5 w-3.5 text-[#f87171]" />,
    },
  ];

  const quickStats = [
    {
      key: 'rating',
      label: t('tourism.rating', 'Đánh giá'),
      value:
        averageDisplayRating > 0 ? (
          <div className="flex items-center gap-1 text-[14px] font-medium text-[#2e6f40]">
            <span>{averageDisplayRating.toFixed(1)}</span>
            <Star className="h-3.5 w-3.5" />
          </div>
        ) : (
          <span className="text-foreground text-[14px] font-medium">-</span>
        ),
    },
    {
      key: 'hours',
      label: t('tourism.opening_hours', 'Giờ mở'),
      value: <span className="text-foreground text-[14px] font-medium">{openingHours}</span>,
    },
    {
      key: 'ticket',
      label: t('tourism.ticket_price', 'Giá vé'),
      value: (
        <span
          className={`text-[14px] font-medium ${
            ticketDisplay === t('tourism.free', 'Miễn phí') ? 'text-[#2e6f40]' : 'text-foreground'
          }`}
        >
          {ticketDisplay}
        </span>
      ),
    },
    {
      key: 'crowd',
      label: t('tourism.crowd_level', 'Lượng người'),
      value: (
        <span
          className={`text-[14px] font-medium ${isHighCrowd ? 'text-[#ba7517]' : 'text-[#2e6f40]'}`}
        >
          {crowdStatus}
        </span>
      ),
    },
  ];

  return (
    <RootLayout>
      <div className="bg-background min-h-screen pb-8">
        <div className="mx-auto max-w-7xl px-3 py-4 md:px-4">
          <TourismDetailTopBar
            onBack={() => navigate('/tourism-point')}
            isLiked={isLiked}
            onToggleFavorite={toggleFavorite}
            onShare={shareLink}
            t={t}
            shareStatus={shareStatus}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <main className="space-y-3">
              <TourismDetailHero
                imageSrc={safeImagesMapped[currentImageIndex]}
                title={attraction.name || t('tourism.unknown', 'Địa điểm chưa rõ tên')}
                subtitle={
                  [attraction.address, distanceText].filter(Boolean).join(' • ') ||
                  t('tourism.location_pending', 'Đang cập nhật vị trí')
                }
                tags={heroTags}
                totalImages={safeImagesMapped.length}
                t={t}
              />

              <TourismDetailQuickStats stats={quickStats} />

              <TourismDetailGallerySection
                images={galleryPreviewImages}
                title={attraction.name}
                onPickImage={(index) => setCurrentImageIndex(index % safeImagesMapped.length)}
                t={t}
              />

              <TourismDetailIntroSection description={plainDescription} tags={introTags} t={t} />

              <TourismDetailReviewsSection
                t={t}
                averageDisplayRating={averageDisplayRating}
                totalReviewCount={totalReviewCount}
                starCounts={starCounts}
                isLoading={reviewsQuery.isLoading}
                reviews={safeReviewItems}
                computeDisplayRating={computeDisplayRating}
                onDeleteReview={handleDeleteReview}
                pageDisplay={pageDisplay}
                pagesDisplay={pagesDisplay}
                reviewPage={reviewPage}
                onPrevPage={() => setReviewPage((p) => Math.max(1, p - 1))}
                onNextPage={() => setReviewPage((p) => p + 1)}
                newVisitDate={newVisitDate}
                onVisitDateChange={setNewVisitDate}
                newRecommend={newRecommend}
                onRecommendChange={setNewRecommend}
                criteria={[
                  {
                    key: 'cleanliness',
                    label: t('tourism.cleanliness', 'Sạch sẽ'),
                    value: newCleanliness,
                    hover: hoverCleanliness,
                    setValue: setNewCleanliness,
                    setHover: setHoverCleanliness,
                  },
                  {
                    key: 'service',
                    label: t('tourism.service', 'Dịch vụ'),
                    value: newService,
                    hover: hoverService,
                    setValue: setNewService,
                    setHover: setHoverService,
                  },
                  {
                    key: 'value',
                    label: t('tourism.value', 'Giá trị'),
                    value: newValue,
                    hover: hoverValue,
                    setValue: setNewValue,
                    setHover: setHoverValue,
                  },
                  {
                    key: 'accessibility',
                    label: t('tourism.accessibility', 'Tiếp cận'),
                    value: newAccessibility,
                    hover: hoverAccessibility,
                    setValue: setNewAccessibility,
                    setHover: setHoverAccessibility,
                  },
                ]}
                newComment={newComment}
                onCommentChange={setNewComment}
                onSelectFiles={handleFilesChange}
                previews={previews}
                onRemoveFile={handleRemoveFile}
                onReset={handleResetReviewForm}
                onSubmit={handleCreateReview}
                isSubmitting={createReviewMut.isPending}
              />
            </main>

            <TourismDetailSidebar
              ticketDisplay={ticketDisplay}
              onOpenMap={handleOpenMap}
              onContact={handleContact}
              rows={sidebarRows}
              nearbyPoints={nearbyPoints}
              t={t}
            />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
