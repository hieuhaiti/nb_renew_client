import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Share2,
  Heart,
  ChevronRight,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Map,
  Route,
} from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
import TourDetailSkeleton from '@/features/tours/components/TourDetailSkeleton';
import { Button } from '@/components/ui/button';
import ModalCarousel from '@/features/map/components/ModalCarousel';
import { useModalCarouselStore } from '@/features/map/store/useModalStore';
import { useTourDetailPageModel } from '@/features/tours/hooks/useTourDetailPageModel';
import { useGetAllTours } from '@/services/api/tours/tourApi';
import { useGetSpotMedia } from '@/services/api/tourism-points/tourismPointsApi';
import { withBaseUrl, formatVND } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const PRIMARY_GRAD = 'linear-gradient(135deg,#12a9b7,#0e9f8f)';
const ORANGE_GRAD = 'linear-gradient(135deg,#ff9f1c,#ffb703)';

function resolveStopSpotId(stop) {
  return (
    stop?.spot_id ||
    stop?.point_id ||
    stop?.spot?.id ||
    stop?.spotId ||
    stop?.tourism_point_id ||
    stop?.destination_id ||
    stop?.location_id ||
    stop?.poi_id ||
    null
  );
}

function normalizeStopMediaUrls(response) {
  const source =
    response?.data?.media ||
    response?.data?.items ||
    response?.media ||
    (Array.isArray(response?.data) ? response.data : null) ||
    [];
  if (!Array.isArray(source)) return [];

  return source
    .filter((item) => {
      const mediaType = String(item?.media_type || item?.type || item?.file_type || '').toLowerCase();
      const mimeType = String(item?.mime_type || '').toLowerCase();
      return !(mediaType.includes('video') || mimeType.startsWith('video/'));
    })
    .map((item) => item?.url || item?.file_url || item?.file_path || item?.path || item?.image_url || '')
    .filter(Boolean);
}

function StopMediaTrigger({ stop, t }) {
  const spotId = resolveStopSpotId(stop);
  const { openCarouselModal } = useModalCarouselStore();
  const { data: mediaResp } = useGetSpotMedia({
    spot_id: spotId,
    options: { enabled: Boolean(spotId) },
  });

  const images = useMemo(() => normalizeStopMediaUrls(mediaResp), [mediaResp]);
  if (images.length === 0) {
    return (
      <div
        className="flex h-10 w-10 items-center justify-center rounded-[15px] text-white"
        style={{ background: ORANGE_GRAD }}
      >
        <MapPin size={16} />
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => openCarouselModal(images)}
      className="relative h-10 w-10 overflow-hidden rounded-[15px] border border-white/50 p-0"
      aria-label={t('tourPage.viewStopGallery', 'Xem thư viện ảnh điểm dừng')}
      title={t('tourPage.viewStopGallery', 'Xem thư viện ảnh điểm dừng')}
    >
      <img src={withBaseUrl(images[0])} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      {images.length > 1 && (
        <span className="absolute right-1 bottom-1 rounded-full bg-black/65 px-1.5 text-[10px] font-black text-white">
          +{images.length - 1}
        </span>
      )}
      <span className="sr-only">{t('tourPage.viewStopGallery', 'Xem thư viện ảnh điểm dừng')}</span>
    </Button>
  );
}
function computeStopsWithTimes(stops) {
  let mins = 8 * 60;
  return stops.map((stop) => {
    const hh = Math.floor(mins / 60)
      .toString()
      .padStart(2, '0');
    const mm = (mins % 60).toString().padStart(2, '0');
    const time = `${hh}:${mm}`;
    mins += (Number(stop.planned_duration_min) || 60) + 30;
    return { ...stop, displayTime: time };
  });
}

function groupStopsByDay(stops) {
  const groups = {};
  stops.forEach((stop, i) => {
    const day = stop.day_number || 1;
    if (!groups[day]) groups[day] = [];
    groups[day].push({ ...stop, _rawIndex: i });
  });
  return Object.keys(groups)
    .sort((a, b) => Number(a) - Number(b))
    .map((day) => ({
      day: Number(day),
      stops: computeStopsWithTimes(groups[day]),
    }));
}

function StarRow({ rating, size = 16 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? 'fill-tertiary text-tertiary'
              : i === full && half
                ? 'fill-tertiary/50 text-tertiary'
                : 'text-muted'
          }
        />
      ))}
    </span>
  );
}

function RelatedTourCard({ tour, onOpen, t }) {
  const name = tour?.name || tour?.name_vi || '';
  const price = Number(tour?.price_from_vnd ?? 0);
  const imgSrc = withBaseUrl(tour?.cover_image_url || '') || placeholderImg;

  return (
    <article
      onClick={onOpen}
      className="cursor-pointer overflow-hidden rounded-[24px] border-border bg-card shadow-(--ambient-shadow) transition hover:-translate-y-0.5"
    >
      <div
        className="h-[130px] bg-cover bg-center"
        style={{ backgroundImage: `url('${imgSrc}')` }}
      />
      <div className="p-[14px]">
        <h4 className="text-foreground mb-1.5 line-clamp-2 text-[15px] font-black">{name}</h4>
        <span className="text-muted-foreground text-[12px] font-black">
          {tour?.duration_days || 1} {t('tourPage.days')} · {t('tourPage.priceFrom').toLowerCase()}{' '}
          {price > 0 ? formatVND(price) : t('tourPage.contact')}
        </span>
      </div>
    </article>
  );
}

export default function TourDetailPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'vi';
  const {
    navigate,
    isLoading,
    isError,
    tour,
    tourName,
    isLiked,
    toggleFavorite,
    shareLink,
    shareStatus,
    safeImagesMapped,
    ticketDisplay,
    averageDisplayRating,
    totalReviewCount,
    tourStops,
    handleOpenMap,
    handleContact,
  } = useTourDetailPageModel(t);

  const { data: relatedData } = useGetAllTours({ page: 1, limit: 4 });
  const relatedTours = useMemo(() => {
    const list = relatedData?.tours || [];
    return list.filter((t) => t.slug !== tour?.slug).slice(0, 3);
  }, [relatedData, tour]);

  const coverImg = safeImagesMapped[0] || placeholderImg;
  const dayGroups = useMemo(() => groupStopsByDay(tourStops), [tourStops]);
  const tourDescription =
    lang === 'en'
      ? tour?.description_en || tour?.description_vi || ''
      : tour?.description_vi || tour?.description_en || '';
  const startLocation =
    lang === 'en'
      ? tour?.start_location_en || tour?.start_location_vi || ''
      : tour?.start_location_vi || tour?.start_location_en || '';
  const endLocation =
    lang === 'en'
      ? tour?.end_location_en || tour?.end_location_vi || ''
      : tour?.end_location_vi || tour?.end_location_en || '';

  if (isLoading) return <TourDetailSkeleton />;

  if (isError || !tour) {
    return (
      <RootLayout>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-foreground mb-4 text-2xl font-black">{t('tourPage.notFound')}</h2>
            <Button variant="ghost" onClick={() => navigate('/tour')}>
              {t('tourPage.back')}
            </Button>
          </div>
      </div>
    </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div
        className="min-h-screen overflow-x-hidden pb-10"
        style={{ background: 'linear-gradient(180deg,#eaf7ff 0,#fff 42%,#f5fbff 100%)' }}
      >
        <div className="px-5 pt-5.5 pb-11 md:px-[5vw]">
          {/* Breadcrumb */}
          <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-2 text-[13px] font-black">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-secondary"
            >
              {t('common.home')}
            </Button>
            <ChevronRight size={11} />
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate('/tour')}
              className="hover:text-secondary"
            >
              {t('headerAside.tour')}
            </Button>
            <ChevronRight size={11} />
            <b className="text-foreground">{tourName}</b>
          </div>

          {/* Hero */}
          <section className="grid grid-cols-1 items-stretch gap-[18px] xl:grid-cols-[1.15fr_.85fr]">
            {/* Hero main */}
            <div
              className="relative flex min-h-[470px] flex-col justify-end overflow-hidden rounded-[32px] p-[30px] text-white shadow-(--ambient-shadow)"
              style={{
                background: `linear-gradient(135deg,rgba(6,32,60,.82),rgba(8,142,130,.62)),url('${coverImg}') center/cover no-repeat`,
              }}
            >
              <span className="mb-[14px] inline-flex w-max items-center gap-2 rounded-full border border-white/30 bg-white/20 px-[13px] py-[9px] text-[13px] font-black">
                <Star size={12} />
                {tour.is_featured ? `${t('tourPage.featured')} · ` : ''}
                {tour.duration_days} {t('tourPage.days')} ·{' '}
                {tour?.province_name || t('tourPage.defaultProvince')}
              </span>
              <h1
                className="mb-3 leading-[1.12] font-black tracking-[-1.4px]"
                style={{ fontSize: 'clamp(26px,4vw,52px)' }}
              >
                {tourName}
              </h1>
              <p className="max-w-[820px] leading-[1.7]" style={{ color: '#eaffff' }}>
                {tourDescription}
              </p>
              <div className="mt-[18px] flex flex-wrap gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full px-4.5 py-3 font-black text-white"
                  style={{
                    background: PRIMARY_GRAD,
                    boxShadow: '0 12px 26px rgba(18,169,183,.25)',
                  }}
                >
                  <CalendarCheck size={14} /> {t('tourPage.bookNow')}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleOpenMap}
                  className="text-secondary inline-flex items-center gap-2 rounded-full bg-card px-4.5 py-3 font-black"
                >
                  <Map size={14} /> {t('tourPage.viewRouteOnMap')}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={shareLink}
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4.5 py-3 font-black text-white"
                >
                  <Share2 size={14} />
                  {shareStatus === 'copied'
                    ? t('tourPage.copied')
                    : shareStatus === 'shared'
                      ? t('tourPage.shared')
                      : t('tourPage.share')}
                </Button>
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-2 gap-[14px]">
              <div
                className="relative col-span-2 min-h-[220px] overflow-hidden rounded-[24px] bg-cover bg-center shadow-(--ambient-shadow)"
                style={{ backgroundImage: `url('${coverImg}')` }}
              >
                <span className="text-secondary absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-[11px] py-2 text-[12px] font-black">
                  Toàn cảnh tuyến
                </span>
              </div>
              {[startLocation, endLocation].map((label, i) => (
                <div
                  key={i}
                  className="relative min-h-[145px] overflow-hidden rounded-[24px] bg-cover bg-center shadow-(--ambient-shadow)"
                  style={{
                    backgroundImage: `url('${coverImg}')`,
                    filter: i === 1 ? 'brightness(.85)' : 'none',
                  }}
                >
                  {label && (
                    <span className="text-secondary absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-[11px] py-2 text-[12px] font-black">
                      {label.split(',')[0]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Content */}
          <section className="mt-[22px] grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Main col */}
            <div className="flex flex-col gap-[18px]">
              {/* Overview */}
              <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
                <h2 className="text-foreground mb-[14px] flex items-center gap-[10px] text-[18px] font-black">
                  {t('tourPage.information')}
                </h2>
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {[
                    {
                      icon: <Clock size={18} />,
                      label: `${tour.duration_days} ngày`,
                      sub: '08:00 - 17:30',
                    },
                    {
                      icon: <MapPin size={18} />,
                      label: `${tourStops.length} điểm dừng`,
                      sub:
                        tourStops
                          .slice(0, 2)
                          .map((s) => s.title_vi || s.spot_name)
                          .join(', ') || 'Ninh Bình',
                    },
                    {
                      icon: <Route size={18} />,
                      label: startLocation?.split(',')[0] || 'Ninh Bình',
                      sub: 'Điểm khởi hành',
                    },
                    {
                      icon: <Users size={18} />,
                      label: `2-${tour.max_guests || 20} khách`,
                      sub: 'Phù hợp gia đình, nhóm bạn',
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-muted rounded-[18px] border p-3.5">
                      <div
                        className="mb-[10px] flex h-[38px] w-[38px] items-center justify-center rounded-[14px] text-white"
                        style={{ background: PRIMARY_GRAD }}
                      >
                        {item.icon}
                      </div>
                      <b className="text-foreground mb-1 block text-[14px] font-black">
                        {item.label}
                      </b>
                      <span className="text-muted-foreground text-[12px] leading-[1.45] font-bold">
                        {item.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
                <h2 className="text-foreground mb-[14px] flex items-center gap-[10px] text-[18px] font-black">
                  {t('tourPage.itinerary')}
                </h2>

                {dayGroups.length === 0 ? (
                  <p className="text-muted-foreground text-[13px]">{t('tourPage.noDescription')}</p>
                ) : (
                  <div className="flex flex-col gap-[14px]">
                    {dayGroups.map((group) => (
                      <div
                        key={group.day}
                        className="bg-muted overflow-hidden rounded-[22px] border"
                      >
                        <div
                          className="text-foreground flex items-center justify-between gap-2 px-4 py-[14px] font-black"
                          style={{ background: 'linear-gradient(135deg,#eafafb,#fff7e6)' }}
                        >
                          <span className="flex items-center gap-2">
                            Ngày {group.day}: {tour.name_vi || tourName}
                          </span>
                          <span className="text-muted-foreground text-[13px] font-bold">
                            {tour.duration_days === 1 ? '08:00 - 17:30' : `Ngày ${group.day}`}
                          </span>
                        </div>
                        {group.stops.map((stop, stopIdx) => (
                          <div
                            key={stop.id || stopIdx}
                            className="grid items-start gap-3 border-t px-4 py-3.75"
                            style={{ gridTemplateColumns: '86px 1fr auto' }}
                          >
                            <div className="bg-secondary/10 text-secondary rounded-[14px] p-2.5 text-center text-[12px] font-black">
                              {stop.displayTime}
                            </div>
                            <div>
                              <h4 className="text-foreground mb-1 font-black">
                                {stop.title_vi || stop.spot_name || `Điểm ${stopIdx + 1}`}
                              </h4>
                              <p className="text-muted-foreground text-[13px] leading-[1.6]">
                                {stop.description_vi || ''}
                                {stop.planned_duration_min
                                  ? ` (${stop.planned_duration_min} phút)`
                                  : ''}
                              </p>
                            </div>
                            <StopMediaTrigger stop={stop} t={t} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Services included / excluded */}
              <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
                <h2 className="text-foreground mb-[14px] flex items-center gap-[10px] text-[18px] font-black">
                  {t('tourPage.includes')} / {t('tourPage.excludes')}
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(tour.includes || []).map((item, i) => (
                    <div
                      key={i}
                      className="bg-muted text-muted-foreground flex gap-[10px] rounded-[17px] border p-3 text-[13px] font-bold"
                    >
                      <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {(tour.excludes || []).map((item, i) => (
                    <div
                      key={i}
                      className="bg-muted text-muted-foreground flex gap-[10px] rounded-[17px] border p-3 text-[13px] font-bold"
                    >
                      <XCircle size={18} className="text-quinary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related tours */}
              {relatedTours.length > 0 && (
                <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
                  <h2 className="text-foreground mb-[14px] flex items-center gap-[10px] text-[18px] font-black">
                    {t('tourPage.relatedTours')}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {relatedTours.map((rt) => (
                      <RelatedTourCard
                        key={rt.id}
                        tour={rt}
                        t={t}
                        onOpen={() => navigate(`/tour/${rt.slug}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-[18px] xl:sticky xl:top-[86px]">
              <div className="overflow-hidden rounded-[28px] border-border bg-card shadow-(--ambient-shadow)">
                <div
                  className="border-b border-border p-5"
                  style={{ background: 'linear-gradient(135deg,#fff8e6,#fff)' }}
                >
                  <small className="text-muted-foreground text-[13px] font-black">
                    {t('tourPage.priceFrom')}
                  </small>
                  <div className="mt-1 flex items-baseline gap-2">
                    <strong className="text-tertiary text-[34px] font-black">
                      {ticketDisplay}
                    </strong>
                    <small className="text-muted-foreground text-[13px] font-black">
                      / {t('tourPage.people')}
                    </small>
                  </div>
                </div>
              </div>

              {/* Rating card */}
              <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
                <h3 className="text-foreground mb-[14px] flex items-center gap-[10px] text-[16px] font-black">
                  {t('tourPage.rating')}
                </h3>
                <div className="mb-2 flex items-center gap-1.5">
                  <StarRow rating={averageDisplayRating} />
                  <span className="text-foreground ml-1.5 text-[16px] font-black">
                    {averageDisplayRating > 0 ? averageDisplayRating.toFixed(1) : '—'}/5
                  </span>
                </div>
                {totalReviewCount > 0 && (
                  <p className="text-muted-foreground text-[13px] leading-[1.6]">
                    Dựa trên {totalReviewCount} đánh giá của du khách, nổi bật về cảnh quan, hướng
                    dẫn viên và tuyến di chuyển hợp lý.
                  </p>
                )}
              </div>

              {/* Guide / Provider card */}
              <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
                <h3 className="text-foreground mb-[14px] flex items-center gap-[10px] text-[16px] font-black">
                  {t('tourPage.provider')}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[20px]">
                    <Users size={26} className="text-secondary" />
                  </div>
                  <div>
                    <b className="text-foreground block text-[15px] font-black">
                      {tour.business_name || 'Hướng dẫn viên địa phương'}
                    </b>
                    <p className="text-muted-foreground mt-1 text-[13px] leading-[1.55]">
                      Am hiểu tuyến {tourName.split(' ').slice(0, 4).join(' ')}.
                    </p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <Heart
                        size={12}
                        className={`cursor-pointer transition ${isLiked ? 'fill-quinary text-quinary' : 'text-muted-foreground'}`}
                        onClick={toggleFavorite}
                      />
                      <span className="text-muted-foreground text-[12px] font-bold">
                        {isLiked ? 'Đã lưu yêu thích' : 'Lưu yêu thích'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
      <ModalCarousel />
    </RootLayout>
  );
}
