import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, ExternalLink, MapPin, Repeat2, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFestivalDetailQuery } from '@/services/api/map/festivalService';
import { withBaseUrl, getLocaleFromLanguage } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

function formatDate(dateStr, locale) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function FestivalDetailPageContent() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);
  const { id } = useParams();

  const { data, isLoading, isError } = useFestivalDetailQuery(id);

  const detail = useMemo(() => {
    if (!data) return null;
    return (
      data?.data?.festival || data?.data?.item || data?.festival || data?.item || data?.data || null
    );
  }, [data]);

  const name = detail?.name || detail?.name_vi || detail?.name_en || '—';
  const description =
    detail?.description ||
    detail?.description_vi ||
    detail?.description_en ||
    t('festivalDetail.no_description');
  const imageSrc = withBaseUrl(detail?.cover_image_url || '');
  const typeLabel = detail?.festival_type
    ? t(`festivalDetail.types.${detail.festival_type}`, { defaultValue: detail.festival_type })
    : '—';
  const startDate = formatDate(detail?.start_date, locale);
  const endDate = formatDate(detail?.end_date, locale);
  const locationName = detail?.location_name || t('festivalDetail.no_location');
  const isRecurring = Boolean(detail?.is_recurring);
  const recurrenceRule = detail?.recurrence_rule;
  const website = detail?.website;
  const provinceCode = detail?.province_code || '';

  if (isLoading) {
    return (
      <RootLayout>
        <div className="bg-background min-h-screen px-4 py-8">
          <div className="border-border/70 bg-card mx-auto max-w-6xl animate-pulse rounded-3xl border p-8" />
        </div>
      </RootLayout>
    );
  }

  if (isError || !detail) {
    return (
      <RootLayout>
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
          <Card className="border-border/70 w-full max-w-xl rounded-3xl">
            <CardContent className="space-y-4 px-6 py-6 text-center">
              <h1 className="typo-card-title text-foreground">{t('festivalDetail.not_found')}</h1>
              <Button className="rounded-xl" onClick={() => navigate('/festival')}>
                {t('festivalDetail.back')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="bg-background min-h-screen px-4 py-4 lg:py-6">
        <div className="mx-auto w-full lg:w-[88%]">
          <Button
            variant="outline"
            className="mb-4 rounded-xl"
            onClick={() => navigate('/festival')}
          >
            {t('festivalDetail.back')}
          </Button>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            {/* Cover image */}
            <Card className="border-border/70 gap-0 overflow-hidden rounded-3xl py-0 shadow-sm">
              <div className="bg-muted h-72 sm:h-96">
                <img
                  src={imageSrc || placeholderImg}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = placeholderImg;
                  }}
                />
              </div>

              {detail?.lat && detail?.lng ? (
                <CardContent className="px-5 py-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin className="text-primary h-4 w-4 shrink-0" />
                    <span>
                      {locationName}
                      {provinceCode ? ` · ${provinceCode}` : ''}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 rounded-xl"
                    onClick={() => navigate('/map')}
                  >
                    <MapPin className="mr-1.5 h-4 w-4" />
                    {t('festivalDetail.view_map')}
                  </Button>
                </CardContent>
              ) : null}
            </Card>

            {/* Info */}
            <Card className="border-border/70 rounded-3xl shadow-sm">
              <CardContent className="space-y-4 px-6 py-6">
                <h1 className="typo-hero text-foreground">{name}</h1>

                <div className="flex flex-wrap gap-2">
                  <span className="typo-badge bg-primary/10 text-primary rounded-full px-3 py-1">
                    {typeLabel}
                  </span>
                  {isRecurring && (
                    <span className="typo-badge bg-secondary/15 text-secondary flex items-center gap-1 rounded-full px-3 py-1">
                      <Repeat2 className="h-3 w-3" />
                      {recurrenceRule === 'yearly'
                        ? t('festivalDetail.recurring_yes')
                        : recurrenceRule || t('festivalDetail.recurring_yes')}
                    </span>
                  )}
                </div>

                <p className="typo-body text-muted-foreground leading-relaxed">{description}</p>

                <div className="border-border/70 bg-card space-y-2.5 rounded-2xl border p-4">
                  <p className="typo-body text-foreground flex items-start gap-2">
                    <CalendarDays className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="font-medium">{t('festivalDetail.dates_label')}: </span>
                      {startDate}
                    </span>
                  </p>

                  {endDate && endDate !== startDate ? (
                    <p className="typo-body text-foreground flex items-start gap-2">
                      <CalendarDays className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                      <span>{endDate}</span>
                    </p>
                  ) : null}

                  <p className="typo-body text-foreground flex items-center gap-2">
                    <MapPin className="text-primary h-4 w-4 shrink-0" />
                    <span>{locationName}</span>
                  </p>

                  <p className="typo-body text-foreground flex items-center gap-2">
                    <Tag className="text-primary h-4 w-4 shrink-0" />
                    <span>
                      {t('festivalDetail.type_label')}: {typeLabel}
                    </span>
                  </p>

                  {provinceCode ? (
                    <p className="typo-body text-foreground">
                      {t('festivalDetail.location_label')}:{' '}
                      {provinceCode === 'NB' ? 'Ninh Bình' : provinceCode}
                    </p>
                  ) : null}
                </div>

                {website ? (
                  <Button
                    className="w-full rounded-xl"
                    onClick={() => window.open(website, '_blank', 'noopener,noreferrer')}
                  >
                    {t('festivalDetail.website_label')}
                    <ExternalLink className="ml-1.5 h-4 w-4" />
                  </Button>
                ) : null}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => navigate('/map')}
                  >
                    {t('common.map')}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => navigate('/tour')}
                  >
                    {t('common.tourist_route')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
