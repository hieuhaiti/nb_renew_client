import { useMemo } from 'react';
import { Layers3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import outdoorPreview from '@/assets/map_preview/outdoor_preview.png';
import streetPreview from '@/assets/map_preview/street_preview.png';
import satellitePreview from '@/assets/map_preview/satellite_preview.png';
import hybridPreview from '@/assets/map_preview/hybrid_preview.png';
import { cn } from '@/lib/utils';

const styleMetaById = {
  outdoor: {
    style: env.mapboxStyle_Outdoor,
    titleKey: 'mapStyle.outdoor',
    descKey: 'mapStyle.outdoorDesc',
    fallbackTitle: 'Outdoor',
    fallbackDesc: 'Suitable for nature trips',
  },
  street: {
    style: env.mapboxStyle_Street,
    titleKey: 'mapStyle.street',
    descKey: 'mapStyle.streetDesc',
    fallbackTitle: 'Street',
    fallbackDesc: 'Good for service visibility',
  },
  satellite: {
    style: env.mapboxStyle_Satellite,
    titleKey: 'mapStyle.satellite',
    descKey: 'mapStyle.satelliteDesc',
    fallbackTitle: 'Satellite',
    fallbackDesc: 'Current field status',
  },
  satelliteStreet: {
    style: env.mapboxStyle_Satellite_Street,
    titleKey: 'mapStyle.satelliteStreet',
    descKey: 'mapStyle.satelliteStreetDesc',
    fallbackTitle: 'Satellite street',
    fallbackDesc: 'Current field status',
  },
};

const previewByStyleId = {
  outdoor: outdoorPreview,
  street: streetPreview,
  satellite: satellitePreview,
  satelliteStreet: hybridPreview,
};

export default function DataLayerMapStylePanel({
  basemapOptions = [],
  activeBasemap,
  onBasemapChange,
  className,
}) {
  const { t } = useTranslation();

  const options = useMemo(() => {
    const source =
      Array.isArray(basemapOptions) && basemapOptions.length > 0
        ? basemapOptions
        : Object.keys(styleMetaById).map((id) => ({ id }));

    return source
      .map((item) => {
        const id = item?.id;
        const meta = styleMetaById[id];
        if (!id || !meta?.style) return null;

        return {
          id,
          title: t(meta.titleKey, { defaultValue: item.title || meta.fallbackTitle }),
          description: t(meta.descKey, {
            defaultValue: item.description || meta.fallbackDesc,
          }),
          preview: previewByStyleId[id],
        };
      })
      .filter(Boolean);
  }, [basemapOptions, t]);

  return (
    <section className={cn('space-y-3', className)} aria-label={t('mapStyle.toggle')}>
      <div className="flex items-center gap-2">
        <Layers3 className="text-muted-foreground size-4.5" />
        <h3 className="text-sm font-semibold">{t('mapStyle.toggle')}</h3>
      </div>

      {options.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          {t('mapStyle.unavailable', { defaultValue: 'No basemap style is configured.' })}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {options.map((item) => {
            const isActive = activeBasemap === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                onClick={() => onBasemapChange?.(item.id)}
                className={cn(
                  'group bg-card hover:bg-muted/30 h-auto w-full flex-col items-start justify-start gap-1.5 rounded-lg border p-1.5 text-left transition-colors',
                  isActive ? 'border-primary bg-primary-soft/35' : 'border-border'
                )}
                title={item.description}
                aria-pressed={isActive}
              >
                <span
                  className="block h-12 w-full rounded-md border border-black/10 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: item.preview ? `url(${item.preview})` : 'none',
                    backgroundColor: item.preview ? 'transparent' : '#e5e7eb',
                  }}
                />
                <span className="truncate text-xs font-semibold">{item.title}</span>
              </Button>
            );
          })}
        </div>
      )}
    </section>
  );
}
