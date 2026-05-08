import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, Clock3, Ticket, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import placeholderImg from '@/assets/images/placeholder.png';
import { formatVND, withBaseUrl } from '@/lib/utils';
import { useGetTourBySlug, useGetTourStops } from '@/services/api/tours/tourApi';
import { useGetTourReviewByTourId, useCreateTourReview } from '@/services/api/tours/tourReviewApi';
import { stripHtmlTags, getDurationLabel } from '@/features/tours/utils/tourDetail.utils';
import { useLanguageStore } from '@/stores/useLanguageStore.js';

function getTicketDisplay(tour, t) {
  const price = Number(tour?.price_from_vnd ?? 0);
  if (Number.isFinite(price) && price > 0) return formatVND(price);
  return t('tourPage.contact', 'Liên hệ');
}

export function useTourDetailPageModel(t) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = useLanguageStore((state) => state.lang);

  const { data: tour, isLoading, isError } = useGetTourBySlug(slug);
  const { data: tourStopsResp } = useGetTourStops(tour?.id);

  const tourName = useMemo(
    () =>
      lang === 'en' ? tour?.name_en || tour?.name_vi || '' : tour?.name_vi || tour?.name_en || '',
    [tour, lang]
  );

  const images = useMemo(() => {
    if (!tour?.cover_image_url) return [];
    return [tour.cover_image_url];
  }, [tour]);

  const safeImages = useMemo(() => (images.length > 0 ? images : [placeholderImg]), [images]);
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
      setIsLiked(Boolean(Array.isArray(favs) && favs.includes(String(slug))));
    } catch {
      setIsLiked(false);
    }
  }, [slug]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('tour_favorites');
      const favs = raw && Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const slugStr = String(slug);
      const exists = favs.includes(slugStr);
      const newFavs = exists ? favs.filter((x) => x !== slugStr) : [...favs, slugStr];
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
        await navigator.share({ title: tourName || t('tourPage.shareTitle', 'Tour details'), url });
        setShareStatus('shared');
      } else if (navigator.clipboard?.writeText) {
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
  const createReviewMut = useCreateTourReview({
    onSuccess: () => {
      reviewsQuery.refetch();
    },
  });

  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [accessibilityRating, setAccessibilityRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const newRating = useMemo(() => {
    const c = Number(cleanlinessRating) || 0;
    const s = Number(serviceRating) || 0;
    const v = Number(valueRating) || 0;
    const a = Number(accessibilityRating) || 0;
    if (!c && !s && !v && !a) return 0;
    return Math.round((c + s + v + a) / 4);
  }, [cleanlinessRating, serviceRating, valueRating, accessibilityRating]);

  const handleResetReviewForm = () => {
    setNewComment('');
    setCleanlinessRating(0);
    setServiceRating(0);
    setValueRating(0);
    setAccessibilityRating(0);
  };

  const handleCreateReview = async () => {
    if (!tour?.business_id) return;
    if (!cleanlinessRating || !serviceRating || !valueRating || !accessibilityRating) {
      toast.error(
        t(
          'tourPage.reviewErrorRatings',
          'Vui lòng đánh giá tất cả tiêu chí: sạch sẽ, dịch vụ, giá trị và tiếp cận.'
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
      business_id: tour.business_id,
      stars: Number(Math.max(1, Math.min(5, Math.round(avg)))),
      content: newComment || '',
      cleanliness_rating: Number(cleanlinessRating),
      service_rating: Number(serviceRating),
      value_rating: Number(valueRating),
      accessibility_rating: Number(accessibilityRating),
    };
    createReviewMut.mutate(payload);
    handleResetReviewForm();
  };

  const handleOpenMap = () => navigate('/map');

  const handleContact = () => {
    const name = tour?.business_name;
    toast.info(
      name
        ? t('tourPage.contactBusiness', `Liên hệ nhà cung cấp: ${name}`, { name })
        : t('tourPage.contactNotAvailable', 'Chưa có thông tin liên hệ.')
    );
  };

  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const reviewId = qs.get('review_id');

  const safeReviewItems = useMemo(() => {
    const source =
      reviewsQuery?.data?.data?.reviews || reviewsQuery?.data?.data || reviewsQuery?.data || [];
    return Array.isArray(source) ? source : [];
  }, [reviewsQuery.data]);

  const singleReview = useMemo(() => {
    if (!reviewId) return null;
    return safeReviewItems.find((x) => String(x.id) === String(reviewId)) || null;
  }, [safeReviewItems, reviewId]);

  const starCounts = useMemo(
    () =>
      safeReviewItems.reduce(
        (acc, item) => {
          const rating = Number(item?.rating || 0);
          if (rating >= 1 && rating <= 5) acc[rating] += 1;
          return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      ),
    [safeReviewItems]
  );

  const serverPagination =
    reviewsQuery?.data?.data?.pagination || reviewsQuery?.data?.pagination || null;
  const pageDisplay = serverPagination?.page ?? reviewPage;
  const pagesDisplay =
    serverPagination?.totalPages ?? serverPagination?.pages ?? serverPagination?.total_pages ?? 1;

  const averageDisplayRating = Number(tour?.rating_avg ?? 0);
  const totalReviewCount = Number(tour?.rating_count ?? safeReviewItems.length);

  const durationLabel = getDurationLabel(tour, t);
  const plainDescription = stripHtmlTags(tour?.description_vi || tour?.description_en || '');
  const ticketDisplay = getTicketDisplay(tour, t);

  const heroTags = useMemo(() => {
    const tags = [];
    if (tour?.is_featured) tags.push(t('tourPage.featured', 'Nổi bật'));
    if (tour?.duration_days) tags.push(`${tour.duration_days} ${t('tourPage.days', 'ngày')}`);
    return tags;
  }, [tour, t]);

  const subtitle = tour?.start_location_vi || '';

  const quickStats = [
    {
      key: 'price',
      label: t('tourPage.price', 'Giá từ'),
      value: (
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${
            ticketDisplay === t('tourPage.contact', 'Liên hệ') ? 'text-foreground' : 'text-primary'
          }`}
        >
          <Ticket className="h-3.5 w-3.5" />
          {ticketDisplay}
        </span>
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
      key: 'guests',
      label: t('tourPage.maxGuests', 'Sức chứa'),
      value: (
        <span className="text-foreground inline-flex items-center gap-1 text-sm font-medium">
          <Users className="text-primary h-3.5 w-3.5" />
          {tour?.max_guests ? `${tour.max_guests} ${t('tourPage.people', 'người')}` : '-'}
        </span>
      ),
    },
    {
      key: 'rating',
      label: t('tourPage.rating', 'Đánh giá'),
      value:
        averageDisplayRating > 0 ? (
          <div className="text-primary flex items-center gap-1 text-sm font-medium">
            <span>{averageDisplayRating.toFixed(1)}</span>
            <Star className="fill-gold text-gold h-3.5 w-3.5" />
          </div>
        ) : (
          <span className="text-foreground text-sm font-medium">-</span>
        ),
    },
  ];

  const sidebarRows = [
    {
      key: 'start_location',
      label: t('tourPage.startLocation', 'Địa điểm đi'),
      value: tour?.start_location_vi || t('tourPage.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-primary',
    },
    {
      key: 'end_location',
      label: t('tourPage.endLocation', 'Địa điểm đến'),
      value: tour?.end_location_vi || t('tourPage.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-primary',
    },
    {
      key: 'duration',
      label: t('tourPage.duration', 'Thời lượng'),
      value: durationLabel,
      dotClass: 'bg-primary',
    },
    {
      key: 'provider',
      label: t('tourPage.provider', 'Nhà cung cấp'),
      value: tour?.business_name || t('tourPage.unknown', 'Chưa cập nhật'),
      dotClass: 'bg-warning',
    },
  ];

  const tourStops = useMemo(() => {
    const source =
      tourStopsResp?.data?.stops ||
      tourStopsResp?.data?.tour_stops ||
      tourStopsResp?.stops ||
      tourStopsResp?.tour_stops ||
      tour?.stops ||
      [];
    return Array.isArray(source) ? source : [];
  }, [tourStopsResp, tour]);

  return {
    navigate,
    isLoading,
    isError,
    tour,
    tourName,
    tourStops,
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
    handleOpenMap,
    handleContact,
  };
}
