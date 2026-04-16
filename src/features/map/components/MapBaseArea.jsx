import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

/**
 * MapBaseArea — main map canvas area that stays visible behind overlays.
 */
export default function MapBaseArea({ className, children }) {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('mapPage.layout.mapArea')}
      className={cn('bg-muted/25 relative h-full w-full overflow-hidden', className)}
    >
      <div className="bg-background/40 pointer-events-none absolute inset-0" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </section>
  );
}
