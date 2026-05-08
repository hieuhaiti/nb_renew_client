import { useCallback } from 'react';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { env } from '@/config/env';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useMapStyleStore } from '@/features/map/store/useMapStyleStore';
import outdoorPreview from '@/assets/map_preview/outdoor_preview.png';
import streetPreview from '@/assets/map_preview/street_preview.png';
import satellitePreview from '@/assets/map_preview/satellite_preview.png';
import hybridPreview from '@/assets/map_preview/hybrid_preview.png';

const MAP_STYLES = [
  {
    id: 'outdoor',
    nameKey: 'mapStyle.outdoor',
    descKey: 'mapStyle.outdoorDesc',
    style: env.mapboxStyle_Outdoor,
    preview: outdoorPreview,
  },
  {
    id: 'street',
    nameKey: 'mapStyle.street',
    descKey: 'mapStyle.streetDesc',
    style: env.mapboxStyle_Street,
    preview: streetPreview,
  },
  {
    id: 'satellite',
    nameKey: 'mapStyle.satellite',
    descKey: 'mapStyle.satelliteDesc',
    style: env.mapboxStyle_Satellite,
    preview: satellitePreview,
  },
  {
    id: 'hybrid',
    nameKey: 'mapStyle.satelliteStreet',
    descKey: 'mapStyle.satelliteStreetDesc',
    style: env.mapboxStyle_Satellite_Street,
    preview: hybridPreview,
  },
].filter((item) => item.style);

export default function MapBaseMapChips({ className }) {
  const { t } = useTranslation();
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRefObj = useMapStore((state) => state.mapRefObj);
  const mapStyle = useMapStyleStore((state) => state.mapStyle);
  const setMapStyle = useMapStyleStore((state) => state.setMapStyle);

  const handleSelect = useCallback(
    (styleUrl) => {
      if (mapRef) {
        try {
          mapRef.setStyle(styleUrl, { diff: true });
          const splitMap = mapRefObj?.current?.split;
          if (splitMap && splitMap !== mapRef) {
            splitMap.setStyle(styleUrl, { diff: true });
          }
        } catch {}
      }
      setMapStyle(styleUrl);
    },
    [mapRef, mapRefObj, setMapStyle]
  );

  return (
    <div className={`flex min-w-0 flex-wrap items-center gap-3 xl:flex-1 ${className ?? ''}`}>
      <span className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-sm font-medium">
        <Layers size={13} />
        {t('mapPage.toolbar.baseMap', { defaultValue: 'Base map' })}
      </span>
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-wrap gap-2">
          {MAP_STYLES.map((item) => {
            const isActive = mapStyle === item.style;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    className="h-auto gap-1.5 rounded-lg py-1 pr-2.5 pl-1"
                    onClick={() => handleSelect(item.style)}
                  >
                    <span
                      className="h-5 w-8 flex-none rounded bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.preview})` }}
                    />
                    {t(item.nameKey)}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-sm">
                  {t(item.descKey)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
