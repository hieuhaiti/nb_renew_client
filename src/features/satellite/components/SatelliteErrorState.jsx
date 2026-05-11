import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function SatelliteErrorState({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-3 py-8 px-4 text-center">
      <AlertTriangle size={32} className="text-destructive/70" />
      <p className="typo-body text-destructive">{t('satellite.errors.title')}</p>
      {message && <p className="typo-meta text-muted-foreground">{message}</p>}
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-2 mt-1">
          <RefreshCw size={14} />
          {t('satellite.actions.retry')}
        </Button>
      )}
    </div>
  );
}

export default SatelliteErrorState;
