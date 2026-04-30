import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Clock3, MapPin, Globe, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RootLayout from '@/components/layout/RootLayout';
import { useGetDataPointById } from '@/services/api/tourism-points/tourismPointsApi';
import { formatVND, withBaseUrl } from '@/lib/utils';
import {
  useGetTourismReviewByTourismPointId,
  useCreateTourismReview,
} from '@/services/api/tourism-points/tourismPointsReviewApi';
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

const OPENING_DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const formatOpeningHoursDisplay = (openingHours, language = 'vi') => {
  if (typeof openingHours === 'string') return openingHours;
  if (typeof openingHours === 'number') return String(openingHours);
  if (!openingHours || typeof openingHours !== 'object') return '';

  const directDaily = openingHours?.daily || openingHours?.default;
  if (typeof directDaily === 'string' || typeof directDaily === 'number') {
    return String(directDaily);
  }

  const note =
    language === 'en'
      ? openingHours?.note_en || openingHours?.note_vi
      : openingHours?.note_vi || openingHours?.note_en;
  if (typeof note === 'string' && note.trim()) return note.trim();

  for (const dayKey of OPENING_DAY_KEYS) {
    const dayRange = openingHours?.[dayKey];
    if (!dayRange || typeof dayRange !== 'object') continue;
    const open = dayRange?.open;
    const close = dayRange?.close;
    if (typeof open === 'string' && typeof close === 'string') {
      return `${open} - ${close}`;
    }
  }

  return '';
};

export default function TourismDetailPage() {
  const queryClient = useQueryClient();
  const { slug, id } = useParams();
  const pointSlug = slug || id;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'vi';
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
    point_id: pointSlug,
    format: 'json',
  });
  const attraction = useMemo(() => {
    if (!pointResp) return null;
    // Common shapes:
    // - { data: { spot: {...} } }  (current API)
    // - { data: { point: {...} } }
    // - { spot: {...} } / { point: {...} } / {...}
    return (
      pointResp.data?.spot ||
      pointResp.data?.point ||
      pointResp.spot ||
      pointResp.point ||
      pointResp.data ||
      null
    );
  }, [pointResp]);

  const attractionName =
    attraction?.name_vi ||
    attraction?.name_en ||
    attraction?.name ||
    t('tourism.detail_title', 'Tourism point');
  const attractionAddress =
    attraction?.address_vi || attraction?.address_en || attraction?.address || '';

  // Compute images safely and keep them memoized so hooks below are stable
  // TODO: gallery images from API — use GET /spots/:spotId/media (not yet wired)
  const images = useMemo(() => {
    if (!attraction) return [];
    return (
      (attraction.primary_image ? [attraction.primary_image] : null) ||
      (attraction.cover_image_url ? [attraction.cover_image_url] : null) ||
      (attraction.main_image_url ? [attraction.main_image_url] : null) ||
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

  const favoriteKey = useMemo(
    () => String(attraction?.id || pointSlug || ''),
    [attraction?.id, pointSlug]
  );

  // Favorites: persist liked point ids in localStorage under key 'favorites'
  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites');
      const favs = raw ? JSON.parse(raw) : [];
      setIsLiked(Boolean(favoriteKey && Array.isArray(favs) && favs.includes(favoriteKey)));
    } catch {
      // ignore malformed localStorage
      setIsLiked(false);
    }
  }, [favoriteKey]);

  const toggleFavorite = () => {
    if (!favoriteKey) return;
    try {
      const raw = localStorage.getItem('favorites');
      const favs = raw && Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const exists = favs.includes(favoriteKey);
      const newFavs = exists ? favs.filter((x) => x !== favoriteKey) : [...favs, favoriteKey];
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
          title: attractionName,
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
  const createReviewMut = useCreateTourismReview({
    onSuccess: () => {
      reviewsQuery.refetch();
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

    // Build JSON payload — field names per Postman /ratings spec.
    // TODO: cleanliness_rating / service_rating / value_rating / accessibility_rating /
    //       visit_season / recommend are not in the Postman /ratings spec — verify with backend.
    const payload = {
      spot_id: String(attraction.id),
      stars: Number(overall),
      content: newComment || '',
      // TODO: photo_urls not confirmed in Postman spec — replace images[] with photo_urls[].
      photo_urls: [],
      visit_date: newVisitDate ? new Date(newVisitDate).toISOString() : null,
      cleanliness_rating: Number(newCleanliness) || null,
      service_rating: Number(newService) || null,
      value_rating: Number(newValue) || null,
      accessibility_rating: Number(newAccessibility) || null,
      recommend: Boolean(newRecommend),
    };

    if (selectedFiles && selectedFiles.length > 0) {
      const fd = new FormData();
      fd.append('spot_id', String(payload.spot_id));
      fd.append('stars', String(payload.stars));
      fd.append('content', payload.content || '');
      if (payload.cleanliness_rating !== null)
        fd.append('cleanliness_rating', String(payload.cleanliness_rating));
      if (payload.service_rating !== null)
        fd.append('service_rating', String(payload.service_rating));
      if (payload.value_rating !== null) fd.append('value_rating', String(payload.value_rating));
      if (payload.accessibility_rating !== null)
        fd.append('accessibility_rating', String(payload.accessibility_rating));
      if (payload.visit_date) fd.append('visit_date', payload.visit_date);
      fd.append('recommend', payload.recommend ? 'true' : 'false');

      selectedFiles.forEach((f) => fd.append('photo_urls', f));
      createReviewMut.mutate(fd);
    } else {
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
      await mutater(`ratings/${reviewId}`, 'DELETE');
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
              className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground"
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

  const starCounts = {
    5: derivedStarCounts[5],
    4: derivedStarCounts[4],
    3: derivedStarCounts[3],
    2: derivedStarCounts[2],
    1: derivedStarCounts[1],
  };

  const totalReviewCount =
    Number(attraction.rating_count ?? attraction.total_reviews ?? derivedStarCounts.total) || 0;

  const avgReviewFromStats = Number(attraction.rating_avg ?? attraction.average_rating);
  const averageDisplayRating =
    Number.isFinite(avgReviewFromStats) && avgReviewFromStats > 0 ? avgReviewFromStats : 0;

  const openingHours =
    formatOpeningHoursDisplay(attraction?.opening_hours, lang) ||
    t('tourism.unknown', 'Chua c?p nh?t');

  const entranceFeeRaw =
    attraction?.ticket_price_adult ?? attraction?.entrance_fee ?? attraction?.ticket_price ?? 0;
  const entranceFeeNumber = Number(entranceFeeRaw);
  const ticketDisplay =
    Number.isFinite(entranceFeeNumber) && entranceFeeNumber > 0
      ? formatVND(entranceFeeNumber)
      : t('tourism.free', 'Mi?n phí');

  const capacityPct =
    attraction?.current_capacity_pct != null ? Number(attraction.current_capacity_pct) : null;
  const capacityThreshold = Number(attraction?.alert_threshold_pct) || 75;
  const isHighCrowd = capacityPct !== null && capacityPct > capacityThreshold;
  const crowdDisplay =
    capacityPct !== null ? `${Math.round(capacityPct)}%` : t('tourism.unknown', 'Chua c?p nh?t');

  const ticketChildRaw = attraction?.ticket_price_child ?? 0;
  const ticketChildNumber = Number(ticketChildRaw);
  const ticketChildDisplay =
    Number.isFinite(ticketChildNumber) && ticketChildNumber > 0
      ? formatVND(ticketChildNumber)
      : t('tourism.free', 'Mi?n phí');

  const heroTags = (() => {
    const extracted = [attraction?.category_name, attraction?.province_name]
      .filter(Boolean)
      .map((item) => String(item).trim());
    return [...new Set(extracted)].slice(0, 2);
  })();

  const introTags = (() => {
    const tags = [
      attraction?.category_name,
      attraction?.province_name,
      attraction?.commune_name,
      attraction?.has_vr_360 ? t('tourism.feature_vr360', 'VR 360°') : null,
      attraction?.has_ar_support ? t('tourism.feature_ar', 'AR') : null,
      attraction?.has_audio_guide ? t('tourism.feature_audio_guide', 'Audio guide') : null,
    ]
      .filter(Boolean)
      .map((item) => String(item).trim());
    return [...new Set(tags)].slice(0, 6);
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

  const plainDescription = stripHtmlTags(
    attraction?.description_vi || attraction?.description_en || attraction?.description
  );

  const nearbyPoints = (() => {
    const source = Array.isArray(attraction?.nearby_points)
      ? attraction.nearby_points
      : Array.isArray(attraction?.nearby)
        ? attraction.nearby
        : [];
    return source.slice(0, 4).map((item, index) => ({
      id: item?.id || `nearby-${index}`,
      name:
        item?.name_vi ||
        item?.name_en ||
        item?.name ||
        t('tourism.nearby_point_name', `Ði?m ${index + 1}`),
      distance:
        item?.distance_text ||
        (typeof item?.distance_km === 'number' ? `${item.distance_km.toFixed(1)} km` : null) ||
        item?.distance ||
        t('tourism.nearby_distance_unknown', 'Chua rõ kho?ng cách'),
      image: withBaseUrl(
        item?.primary_image || item?.cover_image_url || item?.main_image_url || item?.image || ''
      ),
    }));
  })();

  const sidebarRows = [
    {
      key: 'location',
      label: t('tourism.location', 'V? trí'),
      value: attractionAddress || t('tourism.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-nature',
      icon: <MapPin className="text-primary h-3.5 w-3.5" />,
    },
    {
      key: 'hours',
      label: t('tourism.opening_hours', 'Giờ mở'),
      value: openingHours,
      dotClass: 'bg-nature',
      icon: <Clock3 className="text-primary h-3.5 w-3.5" />,
    },
    {
      key: 'website',
      label: t('tourism.website', 'Website'),
      value: attraction?.website || t('tourism.unknown', 'Chưa cập nhật'),
      href: attraction?.website || null,
      dotClass: 'bg-primary',
      icon: <Globe className="text-primary h-3.5 w-3.5" />,
    },
    {
      key: 'type',
      label: t('tourism.type', 'Loại hình'),
      value: attraction?.category_name || t('tourism.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-warning',
      icon: <Leaf className="text-warning h-3.5 w-3.5" />,
    },
  ];

  const quickStats = [
    {
      key: 'rating',
      label: t('tourism.rating', 'Đánh giá'),
      value:
        averageDisplayRating > 0 ? (
          <div className="text-nature flex items-center gap-1 text-sm font-medium">
            <span>{averageDisplayRating.toFixed(1)}</span>
            <Star className="h-3.5 w-3.5" />
          </div>
        ) : (
          <span className="text-foreground text-sm font-medium">-</span>
        ),
    },
    {
      key: 'hours',
      label: t('tourism.opening_hours', 'Giờ mở'),
      value: <span className="text-foreground text-sm font-medium">{openingHours}</span>,
    },
    {
      key: 'ticket',
      label: t('tourism.ticket_price', 'Giá vé'),
      value: (
        <span
          className={`text-sm font-medium ${
            ticketDisplay === t('tourism.free', 'Miễn phí') ? 'text-nature' : 'text-foreground'
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
        <span className={`text-sm font-medium ${isHighCrowd ? 'text-warning' : 'text-nature'}`}>
          {crowdDisplay}
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
                title={attractionName}
                subtitle={
                  attractionAddress || t('tourism.location_pending', 'Ðang c?p nh?t v? trí')
                }
                tags={heroTags}
                totalImages={safeImagesMapped.length}
                t={t}
              />

              <TourismDetailQuickStats stats={quickStats} />

              <TourismDetailGallerySection
                images={galleryPreviewImages}
                title={attractionName}
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
              childTicketDisplay={ticketChildDisplay}
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
