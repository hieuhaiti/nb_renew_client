import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export function SatelliteLoadingState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="typo-meta text-muted-foreground animate-pulse">{t('satellite.loading.title')}</p>
      <Skeleton className="h-8 w-full rounded" />
      <Skeleton className="h-8 w-3/4 rounded" />
      <Skeleton className="h-8 w-5/6 rounded" />
      <Skeleton className="h-24 w-full rounded" />
    </div>
  );
}

export default SatelliteLoadingState;
