import { useTranslation } from 'react-i18next';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { cn } from '@/lib/utils';

export default function DirectionDetails({ className }) {
  const { t } = useTranslation();
  const { directions, formatDuration, formatDistance } = useDirectionsStore();

  return (
    <div className={cn('h-full space-y-3', className)}>
      {directions ? (
        <div className="space-y-2">
          <div className="bg-muted/40 grid grid-cols-2 gap-2 rounded-lg border p-2.5">
            <div className="bg-background rounded-md px-2 py-1.5">
              <p className="text-muted-foreground text-xs">
                {t('mapPage.direction.totalDistance', { defaultValue: 'Total distance' })}
              </p>
              <p className="text-sm font-semibold">{formatDistance(directions.distance)}</p>
            </div>
            <div className="bg-background rounded-md px-2 py-1.5">
              <p className="text-muted-foreground text-xs">
                {t('mapPage.direction.totalDuration', { defaultValue: 'Total duration' })}
              </p>
              <p className="text-sm font-semibold">{formatDuration(directions.duration)}</p>
            </div>
          </div>

          <div className="space-y-1.5 rounded-lg border p-2.5">
            <p className="text-xs font-semibold">
              {t('mapPage.direction.stepsTitle', { defaultValue: 'Step-by-step guidance' })}
            </p>
            <div className="max-h-[38vh] space-y-1.5 overflow-y-auto pr-1">
              {(directions.legs?.[0]?.steps || []).map((step, index) => (
                <div
                  key={`${step?.maneuver?.instruction || 'step'}-${index}`}
                  className="bg-muted/40 rounded-md p-2 text-xs"
                  title={step?.maneuver?.instruction || ''}
                >
                  <p className="line-clamp-3 font-medium">
                    {step?.maneuver?.instruction ||
                      t('mapPage.direction.noInstruction', { defaultValue: 'No instruction' })}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {formatDistance(step?.distance || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
