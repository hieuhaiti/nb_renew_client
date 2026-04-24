import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, Clock3, Ticket, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import placeholderImg from '@/assets/images/placeholder.png';
import { formatVND, withBaseUrl } from '@/lib/utils';
import { useGetTourById } from '@/features/tours/api/tourApi';
import {
  useGetTourReviewByTourId,
  useTourReviewStats,
  useCreateTourReview,
} from '@/features/tours/api/tourReviewApi';
import {
  stripHtmlTags,
  getDurationLabel,
  getDistanceLabel,
  getHeroTags,
  getIntroTags,
  getGalleryPreviewImages,
} from '@/features/tours/utils/tourDetail.utils';

function getTicketDisplay(tour, t) {
  const price = Number(tour?.price ?? 0);
  if (Number.isFinite(price) && price > 0) return formatVND(price);
  if (tour?.price_per_person) return t('tourPage.perPerson', 'Theo người');
  return t('tourPage.contact', 'Liên hệ');
}

export function useTourDetailPageModel(t) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: tourResp, isLoading, isError } = useGetTourById(id);
  const tour = useMemo(() => tourResp?.data?.tour || tourResp?.tour || null, [tourResp]);
  const images = useMemo(() => {
    if (!tour) return [];
    return (
      (Array.isArray(tour.gallery_images) && tour.gallery_images.length > 0
        ? tour.gallery_images
        : null) || (tour.main_image_url ? [tour.main_image_url] : [])
    );
  }, [tour]);

  const placeholderImage = placeholderImg;
  const safeImages = useMemo(
    () => (images && images.length > 0 ? images : [placeholderImage]),
    [images]
  );
  const safeImagesMapped = useMemo(() => safeImages.map((s) => withBaseUrl(s)), [safeImages]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (currentImageIndex >= safeImages.length) setCurrentImageIndex(0);
  }, [safeImages, currentImageIndex]);

  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tour_favorites');
      const favs = raw ? JSON.parse(raw) : [];
      setIsLiked(Boolean(favs && Array.isArray(favs) && favs.includes(String(id))));
    } catch {
      setIsLiked(false);
    }
  }, [id]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('tour_favorites');
      const favs = raw && Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const idStr = String(id);
      const exists = favs.includes(idStr);
      const newFavs = exists ? favs.filter((x) => x !== idStr) : [...favs, idStr];
      localStorage.setItem('tour_favorites', JSON.stringify(newFavs));
      setIsLiked(!exists);
    } catch (e) {
      console.error(e);
    }
  };

  const [shareStatus, setShareStatus] = useState('idle');
  const shareLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: tour?.name || t('tourPage.shareTitle', 'Tour details'),
          url,
        });
        setShareStatus('shared');
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setShareStatus('copied');
      } else {
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShareStatus('copied');
      }
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch {
      setShareStatus('idle');
    }
  };

  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLimit] = useState(6);
  const reviewsQuery = useGetTourReviewByTourId({
    page: reviewPage,
    limit: reviewLimit,
    id: tour?.id,
  });
  const reviewStats = useTourReviewStats(tour?.id);
  const createReviewMut = useCreateTourReview({
    onSuccess: () => {
      reviewsQuery.refetch();
      reviewStats.refetch();
    },
  });

  const [newRating, setNewRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [accessibilityRating, setAccessibilityRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const c = Number(cleanlinessRating) || 0;
    const s = Number(serviceRating) || 0;
    const v = Number(valueRating) || 0;
    const a = Number(accessibilityRating) || 0;
    if (c || s || v || a) {
      const avg = (c + s + v + a) / 4;
      setNewRating(Math.round(avg));
    } else {
      setNewRating(0);
    }
  }, [cleanlinessRating, serviceRating, valueRating, accessibilityRating]);

  const handleResetReviewForm = () => {
    setNewComment('');
    setNewRating(0);
    setCleanlinessRating(0);
    setServiceRating(0);
    setValueRating(0);
    setAccessibilityRating(0);
  };

  const handleCreateReview = async () => {
    if (!tour?.id) return;
    if (!cleanlinessRating || !serviceRating || !valueRating || !accessibilityRating) {
      toast.error(
        t(
          'tourPage.reviewErrorRatings',
          'Please provide ratings for all criteria: cleanliness, service, value, and accessibility.'
        )
      );
      return;
    }

    const avg =
      (Number(cleanlinessRating) +
        Number(serviceRating) +
        Number(valueRating) +
        Number(accessibilityRating)) /
      4;

    const payload = {
      tour_id: Number(tour.id),
      rating: Number(Math.max(1, Math.min(5, Math.round(avg)))),
      cleanliness_rating: Number(cleanlinessRating),
      service_rating: Number(serviceRating),
      value_rating: Number(valueRating),
      accessibility_rating: Number(accessibilityRating),
      comment: newComment || '',
    };

    createReviewMut.mutate(payload);
    handleResetReviewForm();
  };

  const handleOpenMap = () => {
    navigate('/map');
  };

  const handleContact = () => {
    const phone = tour?.contact_phone || tour?.phone || tour?.contact?.phone;
    if (!phone) {
      toast.info(t('tourPage.contactNotAvailable', 'Chưa có thông tin liên hệ.'));
      return;
    }
    window.location.href = `tel:${String(phone).trim()}`;
  };

  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const reviewId = qs.get('review_id');
  const singleReview = useMemo(() => {
    const source = reviewsQuery?.data?.data?.reviews || reviewsQuery?.data?.data || [];
    const item = source.find?.((x) => String(x.id) === String(reviewId));
    return item || null;
  }, [reviewsQuery, reviewId]);

  const reviewItems =
    reviewsQuery?.data?.data?.reviews || reviewsQuery?.data?.data || reviewsQuery?.data || [];
  const safeReviewItems = Array.isArray(reviewItems) ? reviewItems : [];

  const statsData = reviewStats?.data?.data || reviewStats?.data || {};
  const fallbackStarCounts = safeReviewItems.reduce(
    (acc, item) => {
      const rating = Number(item?.rating || 0);
      if (rating >= 1 && rating <= 5) acc[rating] += 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  const serverStarCounts = {
    5: Number(statsData?.five_star ?? 0),
    4: Number(statsData?.four_star ?? 0),
    3: Number(statsData?.three_star ?? 0),
    2: Number(statsData?.two_star ?? 0),
    1: Number(statsData?.one_star ?? 0),
  };

  const hasServerStats = Object.values(serverStarCounts).some((x) => Number(x) > 0);
  const starCounts = hasServerStats ? serverStarCounts : fallbackStarCounts;

  const serverPagination =
    reviewsQuery?.data?.data?.pagination || reviewsQuery?.data?.pagination || null;
  const pageDisplay = serverPagination?.page ?? reviewPage ?? 1;
  const pagesDisplay = serverPagination?.pages ?? serverPagination?.total_pages ?? 1;

  const averageDisplayRating = Number(
    statsData?.average_rating ?? statsData?.avg_rating ?? tour?.average_rating ?? 0
  );

  const totalReviewCount = Number(
    statsData?.total_reviews ?? tour?.total_reviews ?? safeReviewItems.length
  );

  const durationLabel = getDurationLabel(tour, t);
  const distanceLabel = getDistanceLabel(tour);
  const heroTags = getHeroTags(tour, t);
  const introTags = getIntroTags(tour, heroTags);
  const galleryPreviewImages = getGalleryPreviewImages(safeImagesMapped);
  const plainDescription = stripHtmlTags(tour?.description);
  const ticketDisplay = getTicketDisplay(tour, t);

  const subtitle = [tour?.address, durationLabel, distanceLabel].filter(Boolean).join(' • ');
  const crowdStatus =
    tour?.crowd_status || tour?.crowd_level || t('tourPage.peakStatus', 'Cao điểm');
  const isHighCrowd = /cao|peak|high/i.test(String(crowdStatus));

  const quickStats = [
    {
      key: 'rating',
      label: t('tourPage.rating', 'Đánh giá'),
      value:
        averageDisplayRating > 0 ? (
          <div className="flex items-center gap-1 text-sm font-medium text-nature">
            <span>{averageDisplayRating.toFixed(1)}</span>
            <Star className="h-3.5 w-3.5" />
          </div>
        ) : (
          <span className="text-foreground text-sm font-medium">-</span>
        ),
    },
    {
      key: 'duration',
      label: t('tourPage.duration', 'Thời lượng'),
      value: (
        <span className="text-foreground inline-flex items-center gap-1 text-sm font-medium">
          <Clock3 className="text-primary h-3.5 w-3.5" />
          {durationLabel}
        </span>
      ),
    },
    {
      key: 'ticket',
      label: t('tourPage.price', 'Giá vé'),
      value: (
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${
            ticketDisplay === t('tourPage.contact', 'Liên hệ')
              ? 'text-foreground'
              : 'text-nature'
          }`}
        >
          <Ticket className="h-3.5 w-3.5" />
          {ticketDisplay}
        </span>
      ),
    },
    {
      key: 'crowd',
      label: t('tourPage.crowdLevel', 'Lượng khách'),
      value: (
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${
            isHighCrowd ? 'text-warning' : 'text-nature'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          {crowdStatus}
        </span>
      ),
    },
  ];

  const sidebarRows = [
    {
      key: 'location',
      label: t('tourPage.location', 'Vị trí'),
      value: tour?.address || t('tourPage.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-nature',
    },
    {
      key: 'duration',
      label: t('tourPage.duration', 'Thời lượng'),
      value: durationLabel,
      dotClass: 'bg-nature',
    },
    {
      key: 'schedule',
      label: t('tourPage.schedule', 'Lịch khởi hành'),
      value: tour?.schedule || t('tourPage.daily', 'Hàng ngày'),
      dotClass: 'bg-warning',
    },
    {
      key: 'style',
      label: t('tourPage.type', 'Loại hình'),
      value: heroTags[0] || t('tourPage.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-red-400',
    },
  ];

  const nearbyTours = (() => {
    const source = Array.isArray(tour?.nearby_tours) ? tour.nearby_tours : [];
    if (source.length > 0) {
      return source.slice(0, 4).map((item, index) => ({
        id: item?.id || `nearby-tour-${index}`,
        name: item?.name || t('tourPage.unknown', 'Tour gợi ý'),
        meta: item?.duration_text || item?.price_text || durationLabel,
        image: withBaseUrl(
          item?.main_image_url || item?.image || safeImagesMapped[index % safeImagesMapped.length]
        ),
      }));
    }

    return galleryPreviewImages.slice(0, 4).map((img, index) => ({
      id: `fallback-nearby-tour-${index}`,
      name: t('tourPage.sampleNearbyTour', `Tour ${index + 1}`),
      meta: durationLabel,
      image: img,
    }));
  })();

  return {
    navigate,
    isLoading,
    isError,
    tour,
    isLiked,
    toggleFavorite,
    shareStatus,
    shareLink,
    safeImagesMapped,
    currentImageIndex,
    setCurrentImageIndex,
    subtitle,
    heroTags,
    quickStats,
    galleryPreviewImages,
    plainDescription,
    introTags,
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
    nearbyTours,
    handleOpenMap,
    handleContact,
  };
}
