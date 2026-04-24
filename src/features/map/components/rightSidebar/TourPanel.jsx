import { useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { Clock3, Route, Search, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTourPanelListQuery } from '@/features/map/api/tourPanelService';
import { useTourPanelStore } from '@/features/map/store/useTourPanelStore';
import {
  formatTourDurationLabel,
  formatTourPriceLabel,
  normalizeTourListPayload,
} from '@/features/map/utils/tourPanelUtils';
import { cn, getLocaleFromLanguage, withBaseUrl } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore';

function TourRowSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-8 w-28" />
    </div>
  );
}

export default function TourPanel({ onOpenRoute }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const locale = getLocaleFromLanguage(lang);

  const filters = useTourPanelStore((state) => state.filters);
  const selectedTour = useTourPanelStore((state) => state.selectedTour);
  const setTourPanelFilters = useTourPanelStore((state) => state.setTourPanelFilters);
  const setSelectedTour = useTourPanelStore((state) => state.setSelectedTour);
  const resetTourPanelFilters = useTourPanelStore((state) => state.resetTourPanelFilters);

  const [debouncedSearch] = useDebounce(filters.search, 350);
  const featuredAsBoolean =
    filters.is_featured === 'all' ? undefined : filters.is_featured === 'featured';

  const { data: toursData, isLoading, isFetching, isError } = useTourPanelListQuery({
    ...filters,
    search: debouncedSearch,
    is_featured: featuredAsBoolean,
  });

  const tours = useMemo(() => normalizeTourListPayload(toursData, { lang }), [toursData, lang]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-foreground text-sm font-semibold">
            {t('mapPage.tourPanel.title', { defaultValue: 'Tour du lịch' })}
          </p>
          <p className="text-muted-foreground text-xs">
            {isFetching
              ? t('mapPage.tourPanel.syncing', { defaultValue: 'Đang đồng bộ...' })
              : t('mapPage.tourPanel.count', {
                  defaultValue: '{{count}} tour',
                  count: tours.length,
                })}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 text-xs"
          onClick={resetTourPanelFilters}
        >
          {t('mapPage.tourPanel.reset', { defaultValue: 'Đặt lại' })}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(event) => setTourPanelFilters({ search: event.target.value, page: 1 })}
            placeholder={t('mapPage.tourPanel.searchPlaceholder', {
              defaultValue: 'Tìm tour...',
            })}
            className="h-9 pr-2 pl-8 text-sm"
          />
        </div>

        <Select
          value={filters.is_featured}
          onValueChange={(value) => setTourPanelFilters({ is_featured: value, page: 1 })}
        >
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all', { defaultValue: 'All' })}</SelectItem>
            <SelectItem value="featured">
              {t('mapPage.tourPanel.featuredOnly', { defaultValue: 'Nổi bật' })}
            </SelectItem>
            <SelectItem value="regular">
              {t('mapPage.tourPanel.nonFeatured', { defaultValue: 'Không nổi bật' })}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <TourRowSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          {t('mapPage.tourPanel.error', { defaultValue: 'Không thể tải danh sách tour.' })}
        </div>
      ) : tours.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          {t('mapPage.tourPanel.empty', { defaultValue: 'Không có tour phù hợp với bộ lọc.' })}
        </div>
      ) : (
        <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-0.5">
          {tours.map((tour) => {
            const isActive = selectedTour != null && String(selectedTour.id) === String(tour.id);
            const imageUrl = withBaseUrl(tour.main_image_url);

            return (
              <article
                key={tour.id}
                className={cn(
                  'space-y-2 rounded-lg border p-3 transition-colors',
                  isActive ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                )}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={tour.name}
                    className="h-28 w-full rounded-md object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-foreground truncate text-sm font-semibold" title={tour.name}>
                      {tour.name}
                    </h4>
                    {tour.is_featured && (
                      <Badge variant="secondary" className="shrink-0 gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {t('tourPage.featured', { defaultValue: 'Featured' })}
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock3 className="h-3.5 w-3.5 shrink-0" />
                    {formatTourDurationLabel(tour, t)}
                  </p>

                  <p
                    className="text-muted-foreground line-clamp-3 text-xs"
                    title={tour.description || ''}
                  >
                    {tour.description ||
                      t('tourPage.noDescription', { defaultValue: 'No description' })}
                  </p>

                  <div className="text-foreground text-xs font-semibold">
                    {formatTourPriceLabel(tour, locale)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setSelectedTour(tour);
                      onOpenRoute?.(tour);
                    }}
                  >
                    <Route className="h-3.5 w-3.5" />
                    {t('mapPage.tourPanel.openRoute', { defaultValue: 'Mở chỉ đường' })}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => navigate(`/tour/${tour.id}`)}
                  >
                    {t('tourismPointPage.view_detail', { defaultValue: 'Xem chi tiết' })}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
