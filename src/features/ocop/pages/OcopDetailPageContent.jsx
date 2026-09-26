import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Package, ShieldCheck, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { useGetOcopById } from '@/services/api/ocop/ocopService';
import { formatVND, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { Button } from '@/components/ui/button';

const BTN_GRADIENT = { background: 'var(--gradient-primary)' };

const CATEGORY_COLORS = {
  thuc_pham: { bg: 'bg-success-subtle', text: 'text-success-subtle-foreground', border: 'border-success/30' },
  do_uong: { bg: 'bg-secondary-soft', text: 'text-secondary-soft-foreground', border: 'border-secondary/30' },
  duoc_lieu: { bg: 'bg-success-subtle', text: 'text-success-subtle-foreground', border: 'border-success/30' },
  thuoc_và_cskh: { bg: 'bg-quaternary-soft', text: 'text-quaternary-soft-foreground', border: 'border-quaternary/30' },
  vai_va_may_mac: { bg: 'bg-quaternary-soft', text: 'text-quaternary-soft-foreground', border: 'border-quaternary/30' },
  thu_cong_my_nghe: { bg: 'bg-tertiary-soft', text: 'text-tertiary-soft-foreground', border: 'border-tertiary/30' },
  sinh_vat_canh: { bg: 'bg-success-subtle', text: 'text-success-subtle-foreground', border: 'border-success/30' },
};

const DEFAULT_CAT_COLOR = {
  bg: 'bg-muted',
  text: 'text-muted-foreground',
  border: 'border-border',
};

/* Province code → name mapping; only codes known at build-time are listed here.
 * Unknown codes fall back to a generic "Province {code}" label. */
const PROVINCE_NAMES = { 37: 'Ninh Bình' };

export default function OcopDetailPageContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const { data, isLoading, isError } = useGetOcopById(id);

  const detail = useMemo(() => {
    if (!data) return null;
    return (
      data?.data?.item || data?.data?.product || data?.item || data?.product || data?.data || null
    );
  }, [data]);

  const name = detail?.name || detail?.name_vi || detail?.name_en || t('ocopDetail.default_name');
  const description =
    detail?.description ||
    detail?.description_vi ||
    detail?.description_en ||
    t('ocopDetail.no_description');
  const provinceCode = String(detail?.province_code || '').trim();
  const provinceLabel = provinceCode
    ? PROVINCE_NAMES[provinceCode] || `${t('ocopDetail.labels.province')} ${provinceCode}`
    : '—';
  const imageSrc = withBaseUrl(detail?.cover_image_url || '');
  const priceValue = Number(detail?.price_vnd);
  const priceLabel =
    Number.isFinite(priceValue) && priceValue > 0 ? formatVND(priceValue) : t('common.back');
  const stars = Math.min(5, Math.max(0, Number(detail?.star_rating || 0)));
  const category = detail?.category || '';
  const catColor = CATEGORY_COLORS[category] || DEFAULT_CAT_COLOR;
  const catLabel = category
    ? t(`ocopDetail.categories.${category}`, { defaultValue: category.replace(/_/g, ' ') })
    : '—';

  if (isLoading) {
    return (
      <RootLayout>
        <div className="min-h-screen px-4 py-5 lg:py-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-4 h-9 w-32 animate-pulse rounded-[10px] border border-border/60 bg-muted/40" />
            <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <div className="h-80 animate-pulse rounded-[18px] border border-border/60 bg-muted/40 sm:h-96" />
              <div className="space-y-3">
                <div className="h-8 w-3/4 animate-pulse rounded-[8px] bg-muted/40" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-muted/40" />
                  <div className="h-6 w-24 animate-pulse rounded-full bg-muted/40" />
                </div>
                <div className="h-32 animate-pulse rounded-[12px] border border-border/60 bg-muted/40" />
                <div className="h-24 animate-pulse rounded-[12px] border border-border/60 bg-muted/40" />
                <div className="h-12 animate-pulse rounded-[10px] bg-muted/40" />
              </div>
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (isError || !detail) {
    return (
      <RootLayout>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-[18px] border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-foreground text-sm font-bold 2xl:text-base">
              {t('ocopDetail.default_name')}
            </p>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/ocop')}
              className="mt-4 flex w-full items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              {t('ocopDetail.back')}
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="min-h-screen px-4 py-5 lg:py-6">
        <div className="mx-auto w-full max-w-7xl">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/ocop')}
            className="mb-4 flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft size={15} />
            {t('ocopDetail.back')}
          </Button>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            {/* Image */}
            <div className="relative overflow-hidden rounded-xl border border-border shadow-md">
              <div className="h-72 sm:h-96 lg:h-full lg:min-h-105">
                <img
                  src={imageSrc || placeholderImg}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
              </div>
              {stars > 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full border border-gold/40 bg-gold-soft/95 px-2.5 py-1 text-xs font-bold text-gold-foreground backdrop-blur-sm">
                  <Star size={10} className="fill-rating text-rating" />
                  {stars} {t('ocopDetail.labels.stars')}
                </div>
              )}
              {catLabel && catLabel !== '—' && (
                <div
                  className={`absolute top-3 right-3 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${catColor.bg} ${catColor.text} ${catColor.border}`}
                >
                  {catLabel}
                </div>
              )}
            </div>

            {/* Detail info */}
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-foreground text-lg leading-snug font-black tracking-tight md:text-xl xl:text-2xl">
                  {name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {stars > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold-soft px-2.5 py-0.5 text-xs font-bold text-gold-foreground">
                      {'★'.repeat(stars)}
                      {'☆'.repeat(5 - stars)} · {stars} {t('ocopDetail.labels.stars')}
                    </span>
                  )}
                  {catLabel && catLabel !== '—' && (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${catColor.bg} ${catColor.text} ${catColor.border}`}
                    >
                      {catLabel}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

              <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="text-foreground flex items-center gap-2.5 text-sm">
                  <Package size={15} className="shrink-0 text-primary" />
                  <span className="text-muted-foreground">{t('ocopDetail.labels.unit')}:</span>
                  <span className="font-semibold">{detail?.unit || '—'}</span>
                </div>
                <div className="text-foreground flex items-center gap-2.5 text-sm">
                  <MapPin size={15} className="shrink-0 text-primary" />
                  <span className="text-muted-foreground">{t('ocopDetail.labels.province')}:</span>
                  <span className="font-semibold">{provinceLabel}</span>
                </div>
                {detail?.producer_name && (
                  <div className="text-foreground flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 shrink-0 text-primary">🏭</span>
                    <span className="text-muted-foreground shrink-0">
                      {t('ocopDetail.labels.producer')}:
                    </span>
                    <span className="font-semibold">{detail.producer_name}</span>
                  </div>
                )}
                {detail?.certification_no && (
                  <div className="text-foreground flex items-center gap-2.5 text-sm">
                    <ShieldCheck size={15} className="shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      {t('ocopDetail.labels.certification')}:
                    </span>
                    <span className="font-mono text-xs font-semibold">
                      {detail.certification_no}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-muted-foreground mb-1 text-xs">{t('ocopDetail.labels.price')}</p>
                <p className="text-lg font-black text-price md:text-xl xl:text-2xl">
                  {priceLabel}
                </p>
                {detail?.unit && priceValue > 0 && (
                  <p className="text-muted-foreground mt-0.5 text-xs">/{detail.unit}</p>
                )}
              </div>

              <Button
                variant="ghost"
                type="button"
                onClick={() =>
                  detail?.shop_url && window.open(detail.shop_url, '_blank', 'noopener,noreferrer')
                }
                disabled={!detail?.shop_url}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] text-sm font-bold text-primary-foreground disabled:opacity-40"
                style={BTN_GRADIENT}
              >
                {t('ocopDetail.view_map')}
                <ExternalLink size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
