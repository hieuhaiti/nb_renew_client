import { ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import DirectionDetails from '@/features/map/components/rightSidebar/DirectionDetails';

/**
 * @param {{ isOpen: boolean, onOpen: () => void, onClose: () => void, embedded?: boolean, className?: string, panelWidthClass?: string }} props
 */
export default function MapDirectionPanel({
  isOpen,
  onOpen,
  onClose,
  embedded = false,
  className,
  panelWidthClass,
}) {
  const { t } = useTranslation();
  const resolvedPanelWidthClass = panelWidthClass || (embedded ? 'w-full' : 'w-80');

  if (!isOpen) {
    if (embedded) {
      return (
        <div className={className}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('common.open', { defaultValue: 'Open' })}
            className="bg-background/95 border-border/80 h-9 w-9 rounded-xl border shadow-sm backdrop-blur-sm"
            onClick={onOpen}
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="absolute top-4 bottom-4 left-4 z-20 flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t('common.open', { defaultValue: 'Open' })}
          className="bg-background/95 border-border/80 absolute -left-6 rounded-r-xl border border-l-0 shadow-sm backdrop-blur-sm"
          onClick={onOpen}
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  if (embedded) {
    return (
      <div className={className}>
        <div
          className={`bg-background/95 border-border/80 relative flex h-full min-h-0 ${resolvedPanelWidthClass} flex-col rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-300`}
        >
          <header className="border-border/60 flex shrink-0 items-center justify-between border-b px-3 py-2">
            <p className="typo-section-title">
              {t('mapPage.direction.title', { defaultValue: 'Directions' })}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t('common.close', { defaultValue: 'Close' })}
              className="h-7 w-7 rounded-full shadow-sm"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <DirectionDetails className="h-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 bottom-4 left-4 z-20 flex items-center">
      <div
        className={`bg-background/95 border-border/80 relative flex h-full ${resolvedPanelWidthClass} flex-col rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-300`}
      >
        <header className="border-border/60 flex shrink-0 items-center justify-between border-b px-3 py-2">
          <p className="typo-section-title">
            {t('mapPage.direction.title', { defaultValue: 'Directions' })}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('common.close', { defaultValue: 'Close' })}
            className="h-7 w-7 rounded-full shadow-sm"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <DirectionDetails className="h-full" />
        </div>
      </div>
    </div>
  );
}
