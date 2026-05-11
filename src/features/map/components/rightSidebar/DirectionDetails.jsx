import { useTranslation } from 'react-i18next';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { cn } from '@/lib/utils';

export default function DirectionDetails({ className }) {
  const { t } = useTranslation();
  const { directions, formatDuration, formatDistance } = useDirectionsStore();

  return (
    <div
      className={cn(
        'flex h-full flex-col space-y-3 overflow-hidden rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3',
        className
      )}
    >
      {/* Header */}
      <div className="rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <p className="typo-section-title text-foreground">
          {t('mapPage.direction.title', { defaultValue: 'Chỉ đường' })}
        </p>
        <p className="typo-meta text-muted-foreground">
          {directions
            ? t('mapPage.direction.subtitle', { defaultValue: 'Chi tiết lộ trình' })
            : t('mapPage.direction.empty', { defaultValue: 'Chọn 2 điểm để xem chỉ đường' })}
        </p>
      </div>
      {directions ? (
        <div className="flex h-full flex-col space-y-2">
          <div className="bg-muted/40 grid flex-shrink-0 grid-cols-2 gap-2 rounded-lg border p-2.5">
            <div className="bg-background rounded-md px-2 py-1.5">
              <p className="text-muted-foreground text-sm">
                {t('mapPage.direction.totalDistance', { defaultValue: 'Total distance' })}
              </p>
              <p className="text-sm font-semibold">{formatDistance(directions.distance)}</p>
            </div>
            <div className="bg-background rounded-md px-2 py-1.5">
              <p className="text-muted-foreground text-sm">
                {t('mapPage.direction.totalDuration', { defaultValue: 'Total duration' })}
              </p>
              <p className="text-sm font-semibold">{formatDuration(directions.duration)}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col space-y-1.5 overflow-hidden rounded-lg border p-2.5">
            <p className="text-sm font-semibold">
              {t('mapPage.direction.stepsTitle', { defaultValue: 'Step-by-step guidance' })}
            </p>
            <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
              {(directions.legs?.[0]?.steps || []).map((step, index) => (
                <div
                  key={`${step?.maneuver?.instruction || 'step'}-${index}`}
                  className="bg-muted/40 rounded-md p-2 text-sm"
                  title={step?.maneuver?.instruction || ''}
                >
                  <p className="line-clamp-3 font-medium">
                    {step?.maneuver?.instruction ||
                      t('mapPage.direction.noInstruction', { defaultValue: 'No instruction' })}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
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
