import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Bell,
  Car,
  Utensils,
  Camera,
  Ticket,
  Headphones,
  Eye,
  Users,
  Droplets,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RootLayout from '@/components/layout/RootLayout';
import {
  useGetDataPointBySlug,
  useGetSpotMedia,
} from '@/services/api/tourism-points/tourismPointsApi';
import { formatVND, withBaseUrl } from '@/lib/utils';
import {
  useGetTourismReviewByTourismPointId,
  useCreateTourismReview,
} from '@/services/api/tourism-points/tourismPointsReviewApi';
import { mutater } from '@/services/mutater';
import { toast } from 'react-toastify';
import placeholderImg from '@/assets/images/placeholder.png';
import { TourismDetailSkeleton } from '@/features/tourism-points/components/detail/TourismDetailSkeleton';
import { TourismDetailHero } from '@/features/tourism-points/components/detail/TourismDetailHero';
import { TourismDetailGallerySection } from '@/features/tourism-points/components/detail/TourismDetailGallerySection';
import { TourismDetailIntroSection } from '@/features/tourism-points/components/detail/TourismDetailIntroSection';
import { TourismDetailReviewsSection } from '@/features/tourism-points/components/detail/TourismDetailReviewsSection';
import { TourismDetailSidebar } from '@/features/tourism-points/components/detail/TourismDetailSidebar';
import ModalCarousel from '@/features/map/components/ModalCarousel';
import { useModalCarouselStore } from '@/features/map/store/useModalStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';

/* â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const getDefaultVisitDate = () =>
  new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

const stripHtmlTags = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const pickCoordinate = (...candidates) => {
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const OPENING_DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const formatOpeningHoursDisplay = (openingHours, language = 'vi') => {
  if (typeof openingHours === 'string') return openingHours;
  if (typeof openingHours === 'number') return String(openingHours);
  if (!openingHours || typeof openingHours !== 'object') return '';
  const directDaily = openingHours?.daily || openingHours?.default;
  if (typeof directDaily === 'string' || typeof directDaily === 'number')
    return String(directDaily);
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
    if (typeof open === 'string' && typeof close === 'string') return `${open} - ${close}`;
  }
  return '';
};

const parseOpeningTimeStart = (formatted) => {
  if (!formatted) return null;
  const match = formatted.match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : formatted;
};

/* â”€â”€â”€ static timeline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const SERVICE_ICON_MAP = {
  parking: Car,
  restaurant: Utensils,
  food: Utensils,
  wc: Droplets,
  restroom: Droplets,
  checkin: Camera,
  ticket: Ticket,
  audio_guide: Headphones,
  accessibility: Users,
  vr_360: Eye,
  vr: Eye,
  ar: Eye,
};
const normalizeServiceList = (relatedServices) => {
  if (Array.isArray(relatedServices)) return relatedServices;
  if (!relatedServices || typeof relatedServices !== 'object') return [];
  return (
    relatedServices?.items ||
    relatedServices?.services ||
    relatedServices?.data ||
    relatedServices?.list ||
    []
  );
};
const normalizeServiceKey = (service) => {
  if (typeof service === 'string') return service.trim().toLowerCase();
  if (!service || typeof service !== 'object') return '';
  return String(
    service?.code || service?.slug || service?.service_code || service?.key || service?.name || ''
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
};
const normalizeServiceLabel = (service, key) => {
  if (service && typeof service === 'object') {
    return service?.name_vi || service?.name_en || service?.name || service?.label || key;
  }
  if (typeof service === 'string' && service.trim()) return service;
  return key.replace(/[_-]+/g, ' ').trim();
};
const buildServices = (attraction, t) => {
  const relatedServices = normalizeServiceList(attraction?.related_services);
  const unique = new Map();
  relatedServices.forEach((service) => {
    const key = normalizeServiceKey(service);
    if (!key || unique.has(key)) return;
    const Icon = SERVICE_ICON_MAP[key] || Users;
    unique.set(key, { key, icon: Icon, label: normalizeServiceLabel(service, key) });
  });
  if (attraction?.has_audio_guide && !unique.has('audio_guide')) {
    unique.set('audio_guide', {
      key: 'audio_guide',
      icon: Headphones,
      label: t('tourism.audio_guide', 'Thuyet minh'),
    });
  }
  if (attraction?.has_vr_360 && !unique.has('vr_360')) {
    unique.set('vr_360', {
      key: 'vr_360',
      icon: Eye,
      label: 'VR 360',
    });
  }
  if (attraction?.has_ar_support && !unique.has('ar')) {
    unique.set('ar', {
      key: 'ar',
      icon: Eye,
      label: t('tourism.ar_support', 'AR ho tro'),
    });
  }
  return Array.from(unique.values());
};
/* ??? page ??????????????????????????????????????????????? */

export default function TourismDetailPage() {
  const { slug, id } = useParams();
  const pointSlug = slug || id;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'vi';
  const mapRef = useMapStore((state) => state.mapRef);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [shareStatus, setShareStatus] = useState('idle');
  const { openCarouselModal } = useModalCarouselStore();

  const {
    data: pointResp,
    isError,
    isLoading,
  } = useGetDataPointBySlug({ slug: pointSlug, format: 'json' });

  const attraction = useMemo(() => {
    if (!pointResp) return null;
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
    attraction?.name ||
    attraction?.name_vi ||
    attraction?.name_en ||
    t('tourism.detail_title', 'Tourism point');
  const attractionAddress =
    attraction?.address || attraction?.address_vi || attraction?.address_en || '';

  const { data: spotMediaResp } = useGetSpotMedia({
    spot_id: attraction?.id,
    options: { enabled: Boolean(attraction?.id) },
  });

  const mediaImages = useMemo(() => {
    const source =
      spotMediaResp?.data?.media ||
      spotMediaResp?.data?.items ||
      spotMediaResp?.media ||
      spotMediaResp?.data ||
      [];
    if (!Array.isArray(source)) return [];
    return source
      .filter((item) => {
        const mediaType = String(item?.media_type || item?.type || '').toLowerCase();
        const mimeType = String(item?.mime_type || '').toLowerCase();
        return !(mediaType.includes('video') || mimeType.startsWith('video/'));
      })
      .map((item) => item?.url || item?.file_path || item?.path || item?.image_url || '')
      .filter(Boolean);
  }, [spotMediaResp]);

  const images = useMemo(() => {
    if (mediaImages.length > 0) return mediaImages;
    if (!attraction) return [];
    return (
      (attraction.primary_image ? [attraction.primary_image] : null) ||
      (attraction.cover_image_url ? [attraction.cover_image_url] : null) ||
      (attraction.main_image_url ? [attraction.main_image_url] : null) ||
      []
    );
  }, [attraction, mediaImages]);

  const safeImages = useMemo(
    () => (Array.isArray(images) && images.length > 0 ? images : [placeholderImg]),
    [images]
  );
  const safeImagesMapped = useMemo(() => safeImages.map((s) => withBaseUrl(s)), [safeImages]);

  useEffect(() => {
    if (currentImageIndex >= safeImages.length) setCurrentImageIndex(0);
  }, [safeImages, currentImageIndex]);

  const favoriteKey = useMemo(
    () => String(attraction?.id || pointSlug || ''),
    [attraction?.id, pointSlug]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites');
      const favs = raw ? JSON.parse(raw) : [];
      setIsLiked(Boolean(favoriteKey && Array.isArray(favs) && favs.includes(favoriteKey)));
    } catch {
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
      /* ignore */
    }
  };

  const shareLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: attractionName, url });
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

  const handleViewAllPhotos = () => {
    if (!safeImagesMapped.length) return;
    openCarouselModal(safeImagesMapped);
  };

  /* reviews */
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
  const [newStars, setNewStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newPros, setNewPros] = useState('');
  const [newCons, setNewCons] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newVisitDate, setNewVisitDate] = useState(getDefaultVisitDate());
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    setReviewPage(1);
  }, [attraction?.id]);

  useEffect(() => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = Array.from(selectedFiles).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [selectedFiles]);

  const handleFilesChange = (e) => {
    if (!e.target.files) return;
    setSelectedFiles(Array.from(e.target.files));
  };
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateReview = async () => {
    if (!attraction?.id) return;
    if (Number(newStars) === 0) {
      toast.error(t('tourism.review.missing_rating', 'Vui lòng chọn số sao đánh giá.'));
      return;
    }
    const payload = {
      spot_id: String(attraction.id),
      stars: Number(newStars),
      title: newTitle || '',
      content: newComment || '',
      pros: newPros || '',
      cons: newCons || '',
      visit_date: newVisitDate ? new Date(newVisitDate).toISOString() : null,
    };
    if (selectedFiles && selectedFiles.length > 0) {
      const fd = new FormData();
      fd.append('spot_id', payload.spot_id);
      fd.append('stars', String(payload.stars));
      if (payload.title) fd.append('title', payload.title);
      fd.append('content', payload.content);
      if (payload.pros) fd.append('pros', payload.pros);
      if (payload.cons) fd.append('cons', payload.cons);
      if (payload.visit_date) fd.append('visit_date', payload.visit_date);
      selectedFiles.forEach((f) => fd.append('photo_urls', f));
      createReviewMut.mutate(fd);
    } else {
      createReviewMut.mutate(payload);
    }
    setNewStars(0);
    setNewTitle('');
    setNewComment('');
    setNewPros('');
    setNewCons('');
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleResetReviewForm = () => {
    setNewStars(0);
    setNewTitle('');
    setNewComment('');
    setNewPros('');
    setNewCons('');
    setNewVisitDate(getDefaultVisitDate());
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await mutater(`ratings/${reviewId}`, 'DELETE');
      reviewsQuery.refetch();
    } catch {
      /* ignore */
    }
  };

  const handleOpenMap = async (inputCoordinates) => {
    const fallbackLat = pickCoordinate(
      attraction?.geojson?.coordinates?.[1],
      attraction?.lat,
      attraction?.latitude,
      attraction?.location?.lat,
      attraction?.location?.latitude
    );
    const fallbackLng = pickCoordinate(
      attraction?.geojson?.coordinates?.[0],
      attraction?.lng,
      attraction?.longitude,
      attraction?.location?.lng,
      attraction?.location?.longitude
    );
    const coordinatesFromInput =
      Array.isArray(inputCoordinates) &&
      inputCoordinates.length >= 2 &&
      Number.isFinite(Number(inputCoordinates[0])) &&
      Number.isFinite(Number(inputCoordinates[1]))
        ? [Number(inputCoordinates[0]), Number(inputCoordinates[1])]
        : null;
    const fallbackCoordinates =
      Number.isFinite(fallbackLng) && Number.isFinite(fallbackLat)
        ? [fallbackLng, fallbackLat]
        : null;
    const coordinates = coordinatesFromInput || fallbackCoordinates;
    const resolvedDescription = stripHtmlTags(
      attraction?.description_vi || attraction?.description_en || attraction?.description || ''
    );

    const selectedSearchResult = {
      id: attraction?.id,
      slug: attraction?.slug || pointSlug || null,
      name: attractionName || '',
      description: resolvedDescription,
      address: attractionAddress || attraction?.location_name || '',
      coordinates,
      category_id: attraction?.category_id ?? null,
      subcategory_id: attraction?.subcategory_id ?? null,
      raw: attraction,
    };

    if (coordinates && mapRef) {
      highlightPointOnMap(mapRef, {
        id: attraction?.id,
        coordinates,
        properties: attraction || {},
      });
    }

    navigate('/map', {
      state: {
        prefillKeyword: attractionName || '',
        selectedSearchResult,
      },
    });
  };

  const handleContact = () => {
    const phone = attraction?.contact_phone || attraction?.phone || attraction?.contact?.phone;
    if (!phone) {
      toast.info(t('tourism.contact_not_available', 'Chưa có thông tin liên hệ.'));
      return;
    }
    window.location.href = `tel:${String(phone).trim()}`;
  };

  /* â”€â”€â”€ loading / error â”€â”€â”€â”€ */
  if (isLoading) {
    return (
      <RootLayout>
        <TourismDetailSkeleton />
      </RootLayout>
    );
  }
  if (!attraction || isError) {
    return (
      <RootLayout>
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-foreground mb-4 text-2xl font-bold">
              {t('tourism.not_found', 'Tourism point not found')}
            </h2>
            <Button variant="ghost" onClick={() => navigate('/tourism-point')}>
              {t('tourism.back_to_list', 'Back to list')}
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  /* â”€â”€â”€ derived display values â”€â”€â”€â”€â”€ */

  const computeDisplayRating = (r) => {
    if (!r) return 0;
    return Math.round(Number(r.stars ?? r.rating ?? 0));
  };

  const serverPagination =
    reviewsQuery?.data?.data?.pagination || reviewsQuery?.data?.pagination || null;
  const pageDisplay = serverPagination?.page ?? reviewPage ?? 1;
  const pagesDisplay =
    serverPagination?.totalPages ?? serverPagination?.total_pages ?? serverPagination?.pages ?? 1;

  const reviewItems =
    reviewsQuery?.data?.data?.ratings ||
    reviewsQuery?.data?.data?.reviews ||
    reviewsQuery?.data?.data?.items ||
    [];
  const safeReviewItems = Array.isArray(reviewItems) ? reviewItems : [];

  const derivedStarCounts = safeReviewItems.reduce(
    (acc, item) => {
      const rating = Math.min(5, Math.max(1, computeDisplayRating(item)));
      if (rating >= 1 && rating <= 5) acc[rating] += 1;
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
    t('tourism.unknown', 'Chưa cập nhật');
  const openingTimeStart = parseOpeningTimeStart(openingHours);

  const entranceFeeNumber = Number(
    attraction?.ticket_price_adult ?? attraction?.entrance_fee ?? attraction?.ticket_price ?? 0
  );
  const ticketDisplay =
    Number.isFinite(entranceFeeNumber) && entranceFeeNumber > 0
      ? formatVND(entranceFeeNumber)
      : t('tourism.free', 'Miễn phí');

  const plainDescription = stripHtmlTags(
    attraction?.description_vi || attraction?.description_en || attraction?.description
  );

  const attractionGeo = attraction?.geojson?.coordinates;
  const attractionLat = pickCoordinate(
    Array.isArray(attractionGeo) ? attractionGeo[1] : null,
    attraction?.lat,
    attraction?.latitude,
    attraction?.location?.lat,
    attraction?.location?.latitude
  );
  const attractionLng = pickCoordinate(
    Array.isArray(attractionGeo) ? attractionGeo[0] : null,
    attraction?.lng,
    attraction?.longitude,
    attraction?.location?.lng,
    attraction?.location?.longitude
  );

  const galleryPreviewImages = (() => {
    if (!safeImagesMapped.length) return [];
    const picked = safeImagesMapped.slice(0, 5);
    if (picked.length === 5) return picked;
    const filled = [...picked];
    while (filled.length < 5)
      filled.push(safeImagesMapped[filled.length % safeImagesMapped.length]);
    return filled;
  })();

  const services = buildServices(attraction, t);

  /* â”€â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  return (
    <RootLayout>
      <div className="min-h-screen bg-[#f5fbff] pb-10">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-[13px] font-extrabold text-[#42627a]">
            <Button variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 transition-colors hover:text-[#08aeb9]"
            >
              {t('common.home', 'Trang chủ')}
            </Button>
            <ChevronRight className="h-3 w-3 text-[#08aeb9]" />
            <Button variant="ghost"
              onClick={() => navigate('/tourism-point')}
              className="transition-colors hover:text-[#08aeb9]"
            >
              {t('tourism.title', 'Điểm du lịch')}
            </Button>
            <ChevronRight className="h-3 w-3 text-[#08aeb9]" />
            <span className="truncate text-[#08aeb9]">{attractionName}</span>
          </nav>

          {/* Hero */}
          <TourismDetailHero
            imageSrc={safeImagesMapped[currentImageIndex]}
            title={attractionName}
            subtitle={attractionAddress}
            description={plainDescription}
            categoryTag={attraction?.category_name}
            totalImages={safeImagesMapped.length}
            openingTime={openingTimeStart}
            ticketDisplay={ticketDisplay}
            ratingAvg={averageDisplayRating}
            ratingCount={totalReviewCount}
            capacityPct={attraction?.current_capacity_pct}
            maxCapacity={attraction?.max_capacity}
            isLiked={isLiked}
            onToggleFavorite={toggleFavorite}
            onShare={shareLink}
            t={t}
          />

          {/* Share feedback toast */}
          {shareStatus !== 'idle' && (
            <div className="mt-3 rounded-[10px] border border-[#dcecf7] bg-white px-4 py-2.5 text-sm font-medium text-[#42627a]">
              {shareStatus === 'copied'
                ? t('tourism.share.copied', 'Đã sao chép liên kết')
                : t('tourism.share.shared', 'Đã chia sẻ')}
            </div>
          )}

          {/* Two-column layout */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <main className="space-y-5">
              {/* Intro */}
              <TourismDetailIntroSection
                description={plainDescription}
                address={attractionAddress}
                categoryName={attraction?.category_name}
                provinceName={attraction?.province_name}
                website={attraction?.website}
                openingHours={openingHours}
                t={t}
              />

              {/* Gallery */}
              <TourismDetailGallerySection
                images={galleryPreviewImages}
                totalImages={safeImagesMapped.length}
                title={attractionName}
                onPickImage={(index) => setCurrentImageIndex(index % safeImagesMapped.length)}
                onViewAll={handleViewAllPhotos}
                t={t}
              />

              {/* Services */}
              {services.length > 0 && (
                <section className="rounded-[24px] border border-[#dcecf7] bg-white px-5 py-5 shadow-[0_10px_28px_rgba(7,29,54,0.08)]">
                  <h2 className="mb-4 flex items-center gap-2.5 text-xl font-bold text-[#071d36] md:text-2xl">
                    <Bell className="h-6 w-6 text-[#08aeb9]" />
                    {t('tourism.services', 'Dich vu va tien ich')}
                  </h2>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {services.map(({ key, icon: Icon, label }) => (
                      <div
                        key={key}
                        className="rounded-[16px] border border-[#e2eef7] bg-[#f6fbff] px-3 py-[13px] text-center text-[12px] font-extrabold text-[#325066]"
                      >
                        <Icon className="mx-auto mb-2 h-5 w-5 text-[#08aeb9]" />
                        {label}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
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
                newStars={newStars}
                hoverStars={hoverStars}
                onStarsChange={setNewStars}
                onHoverStars={setHoverStars}
                newTitle={newTitle}
                onTitleChange={setNewTitle}
                newVisitDate={newVisitDate}
                onVisitDateChange={setNewVisitDate}
                newComment={newComment}
                onCommentChange={setNewComment}
                newPros={newPros}
                onProsChange={setNewPros}
                newCons={newCons}
                onConsChange={setNewCons}
                onSelectFiles={handleFilesChange}
                previews={previews}
                onRemoveFile={handleRemoveFile}
                onReset={handleResetReviewForm}
                onSubmit={handleCreateReview}
                isSubmitting={createReviewMut.isPending}
              />
            </main>

            {/* Sidebar */}
            <TourismDetailSidebar
              onOpenMap={handleOpenMap}
              onContact={handleContact}
              lat={attractionLat}
              lng={attractionLng}
              radiusKm={8}
              currentPointId={attraction?.id}
              lang={lang}
              currentVisitorCount={attraction?.current_visitor_count}
              capacityPct={attraction?.current_capacity_pct}
              maxCapacity={attraction?.max_capacity}
              t={t}
            />
          </div>
        </div>
      </div>
      <ModalCarousel />
    </RootLayout>
  );
}

